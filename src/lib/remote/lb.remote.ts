import { query, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { titaniumRequest } from '$lib/helpers/titanium';
import { remoteCheckToken } from '$lib/server/token';
import { leaderboardLimit } from '$lib/limits';

import { z } from 'zod';

import { TITANIUM_API_URL } from '$env/static/private';
import type { LeaderboardResponse } from '$lib/interfaces/lb';
import type { GuildSettingsSchema, LeaderboardConfigSchema } from '$lib/validators';

export const getLeaderboard = query(
  z.object({
    guildId: z.string(),
    limit: z.int().max(100).nonnegative(),
    offset: z.int().nonnegative()
  }),
  async ({ guildId, limit, offset }) => {
    const event = await getRequestEvent();
    if (await leaderboardLimit.isLimited(event)) {
      error(429);
    }

    const tokenRecord = await remoteCheckToken(event, false);

    const botInGuild = await titaniumRequest(`${TITANIUM_API_URL}/guild/${guildId}/inguild`);
    if (!botInGuild.in_guild) {
      error(404, 'Leaderboard is disabled');
    }

    const guildModules = (await titaniumRequest(
      `${TITANIUM_API_URL}/guild/${guildId}/settings`
    )) as GuildSettingsSchema;
    if (!guildModules.modules.leaderboard) {
      error(404, 'Leaderboard is disabled');
    }

    const leaderboardSettings = (await titaniumRequest(
      `${TITANIUM_API_URL}/guild/${guildId}/module/leaderboard`
    )) as LeaderboardConfigSchema;
    if (!leaderboardSettings.web_leaderboard_enabled) {
      error(404, 'Leaderboard is disabled');
    }

    if (leaderboardSettings.web_login_required && !tokenRecord) {
      error(401, 'Discord auth required');
    } else if (leaderboardSettings.web_login_required && tokenRecord) {
      const inGuild = await titaniumRequest(`${TITANIUM_API_URL}/user/${tokenRecord.discordUserId}/inguild/${guildId}`);
      if (!inGuild.in_guild) {
        error(403, 'No access');
      }
    }

    const data = (await titaniumRequest(
      `${TITANIUM_API_URL}/guild/${guildId}/leaderboard?limit=${limit}&offset=${offset}`
    )) as LeaderboardResponse;
    return data;
  }
);
