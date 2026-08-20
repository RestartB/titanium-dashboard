import { error, redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import type { ServerBranding, ServerInfo } from '$lib/interfaces/serverInfo';
import type { GuildSettingsSchema } from '$lib/validators/settings';

export const load: LayoutServerLoad = async ({ locals, fetch, url }) => {
  // Get data
  const brandingRequest = await fetch('/api/guild/' + locals.guildId);
  if (!brandingRequest.ok) {
    if (brandingRequest.status === 404 || brandingRequest.status === 403) {
      throw redirect(302, '/');
    }
    error(brandingRequest.status, 'Failed to fetch server branding from Titanium');
  }
  const serverBranding: ServerBranding = await brandingRequest.json();

  let serverInfo: ServerInfo | undefined;
  let serverSettings: GuildSettingsSchema | undefined;
  if (
    url.pathname !== `/guild/${locals.guildId}/moderation/cases` &&
    !url.pathname.startsWith(`/guild/${locals.guildId}/moderation/cases/`)
  ) {
    const infoRequest = await fetch('/api/guild/' + locals.guildId + '/info');
    if (!infoRequest.ok) {
      if (infoRequest.status === 404 || infoRequest.status === 403) {
        throw redirect(302, '/');
      }
      error(infoRequest.status, 'Failed to fetch server info from Titanium');
    }
    serverInfo = await infoRequest.json();

    const settingsRequest = await fetch('/api/guild/' + locals.guildId + '/settings');
    if (!settingsRequest.ok) {
      if (settingsRequest.status === 404 || settingsRequest.status === 403) {
        throw redirect(302, '/');
      }
      error(settingsRequest.status, 'Failed to fetch server settings from Titanium');
    }
    serverSettings = await settingsRequest.json();
  }

  return { serverBranding, serverInfo, serverSettings, cases_only: !locals.dashboard_manager && locals.case_manager };
};
