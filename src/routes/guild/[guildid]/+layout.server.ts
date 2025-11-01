import { error, redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import type { ServerInfo } from '$lib/interfaces/serverInfo';
import type { ServerSettings } from '$lib/interfaces/serverSettings';

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
  // Get data
  const infoRequest = await fetch('/api/guild/' + locals.guildId);

  if (!infoRequest.ok) {
    if (infoRequest.status === 404 || infoRequest.status === 403) {
      throw redirect(302, '/');
    }

    error(infoRequest.status, 'Failed to fetch server info from Titanium');
  }

  const settingsRequest = await fetch('/api/guild/' + locals.guildId + '/settings');

  if (!settingsRequest.ok) {
    if (settingsRequest.status === 404 || settingsRequest.status === 403) {
      throw redirect(302, '/');
    }

    error(settingsRequest.status, 'Failed to fetch server settings from Titanium');
  }

  const serverInfo: ServerInfo = await infoRequest.json();
  const serverSettings: ServerSettings = await settingsRequest.json();

  return { serverInfo, serverSettings };
};
