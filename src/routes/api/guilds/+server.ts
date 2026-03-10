import { error, json } from '@sveltejs/kit';
import { guildsLimit } from '$lib/limits';
import { TITANIUM_API_URL } from '$env/static/private';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  if (await guildsLimit.isLimited(event)) throw error(429);

  const request = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${event.locals.discordToken}`
    }
  });

  if (!request.ok) {
    console.error('Failed to fetch guilds from Discord:', await request.text());
    throw error(request.status, 'Failed to fetch guilds from Discord');
  }

  const guildData = await request.json();
  const guilds = guildData.filter((guild: { permissions: string }) => {
    const permissions = parseInt(guild.permissions);
    return permissions & 0x20 || permissions & 0x8;
  });

  try {
    const mutualRequest = await fetch(`${TITANIUM_API_URL}/user/${event.locals.discordId}/guilds`);

    if (!mutualRequest.ok) {
      console.error('Failed to fetch mutual guilds:', await mutualRequest.text());
      throw error(mutualRequest.status, 'Failed to fetch mutual guilds');
    }

    const mutualGuildIds = await mutualRequest.json();

    const nonMutualGuilds = guilds.filter((guild: { id: string }) => !mutualGuildIds.includes(guild.id));
    const mutualGuilds = guilds.filter((guild: { id: string }) => mutualGuildIds.includes(guild.id));

    return json({ nonMutualGuilds, mutualGuilds });
  } catch (err) {
    if (err instanceof TypeError) {
      console.error('Network error:', err.message);
      throw error(503, 'Titanium is unavailable. Please try again later.');
    }

    throw err;
  }
};
