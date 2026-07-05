import { error } from '@sveltejs/kit';
import { titaniumRequest } from '$lib/helpers/titanium';
import { remoteCheckToken } from '$lib/server/token';
import { TITANIUM_API_URL } from '$env/static/private';

import type { PageServerLoad } from './$types';
import type { ServerInfo } from '$lib/interfaces/serverInfo';
import type { GuildSettingsSchema } from '$lib/validators/settings';
import type { RepConfigSchema } from '$lib/validators';

export const load: PageServerLoad = async (event) => {
  if (!event.params.guildid) {
    error(400, 'Guild ID is required');
  }

  const tokenRecord = await remoteCheckToken(event, false);

  const botInGuild = await titaniumRequest(`${TITANIUM_API_URL}/guild/${event.params.guildid}/inguild`);
  if (!botInGuild.in_guild) {
    return { enabled: false };
  }

  const guildModules = (await titaniumRequest(
    `${TITANIUM_API_URL}/guild/${event.params.guildid}/settings`
  )) as GuildSettingsSchema;
  if (!guildModules.modules.rep) {
    return { enabled: false };
  }

  const repSettings = (await titaniumRequest(
    `${TITANIUM_API_URL}/guild/${event.params.guildid}/module/rep`
  )) as RepConfigSchema;
  if (!repSettings.web_leaderboard_enabled) {
    return { enabled: false };
  }

  const serverInfo = (await titaniumRequest(`${TITANIUM_API_URL}/guild/${event.params.guildid}/info`)) as ServerInfo;

  if (repSettings.web_login_required && !tokenRecord) {
    return { enabled: true, loginRequired: true, serverInfo };
  } else if (repSettings.web_login_required && tokenRecord) {
    const inGuild = await titaniumRequest(
      `${TITANIUM_API_URL}/user/${tokenRecord.discordUserId}/inguild/${event.params.guildid}`
    );
    if (!inGuild.in_guild) {
      return { enabled: true, noAccess: true, serverInfo };
    }
  }

  return { enabled: true, serverInfo };
};
