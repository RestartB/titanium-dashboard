import { titaniumRequest } from '$lib/helpers/titanium';
import { TITANIUM_API_URL } from '$env/static/private';

import type { GuildSettingsSchema } from '$lib/validators';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const serverSettings = (await titaniumRequest(
    `${TITANIUM_API_URL}/guild/${locals.guildId}/settings`
  )) as GuildSettingsSchema;
  return { moderationEnabled: serverSettings.modules.moderation };
};
