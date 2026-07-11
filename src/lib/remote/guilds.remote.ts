import { getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';

import { remoteCheckToken, deleteToken } from '$lib/server/token';
import { DiscordPermission, hasAnyDiscordPermission } from '$lib/helpers/discord';

import { guildsLimit } from '$lib/limits';
import { TITANIUM_API_URL } from '$env/static/private';
import type { ServerInfo } from '$lib/interfaces/serverInfo';

export const getUserGuilds = query(async () => {
  const event = getRequestEvent();

  const tokenRecord = await remoteCheckToken(event);
  if (await guildsLimit.isLimited(event)) throw error(429);

  const request = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${tokenRecord.discordToken}`
    }
  });

  // token revoked
  if (request.status === 401 || request.status === 403) {
    await deleteToken(tokenRecord.token, tokenRecord.discordToken);
    throw error(request.status, request.statusText);
  }

  // other discord error
  if (!request.ok) {
    console.error('Failed to fetch guilds from Discord:', await request.text());
    throw error(request.status, 'Failed to fetch guilds from Discord');
  }

  const guildData: ServerInfo[] = await request.json();
  const mutualRequest = await fetch(`${TITANIUM_API_URL}/user/${tokenRecord.discordUserId}/guilds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user_guilds: guildData.map((guild: ServerInfo) => guild.id) })
  });

  if (!mutualRequest.ok) {
    console.error('Failed to fetch mutual guilds:', await mutualRequest.text());
    throw error(mutualRequest.status, 'Failed to fetch mutual guilds');
  }

  const titaniumGuildIds: { mutual: string[]; delegate: string[] } = await mutualRequest.json();
  const mutualGuildIds = titaniumGuildIds.mutual;

  const ALLOWED_PERMS =
    DiscordPermission.KickMembers |
    DiscordPermission.BanMembers |
    DiscordPermission.ModerateMembers |
    DiscordPermission.Administrator;

  const mutualGuilds: ServerInfo[] = [];
  const nonMutualGuilds: ServerInfo[] = [];

  for (const guild of guildData) {
    const permissions = BigInt(guild.permissions);

    if (hasAnyDiscordPermission(permissions, ALLOWED_PERMS)) {
      if (mutualGuildIds.includes(guild.id)) {
        mutualGuilds.push(guild);
      } else {
        nonMutualGuilds.push(guild);
      }
    } else if (mutualGuildIds.includes(guild.id) && titaniumGuildIds.delegate.includes(guild.id)) {
      mutualGuilds.push(guild);
    }
  }

  return { mutualGuilds, nonMutualGuilds };
});
