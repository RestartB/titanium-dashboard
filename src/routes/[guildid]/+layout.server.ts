import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import type { ServerInfo } from '$lib/types/serverInfo';
import type { ServerSettings } from '$lib/types/serverSettings';

export const load: LayoutServerLoad = async ({ params, fetch }) => {
	// Get data
	const infoRequest = await fetch('/api/' + params.guildid);

	if (!infoRequest.ok) {
		error(infoRequest.status, 'Failed to fetch server info from Titanium');
	}

	const settingsRequest = await fetch('/api/' + params.guildid + '/settings');

	if (!settingsRequest.ok) {
		error(settingsRequest.status, 'Failed to fetch server settings from Titanium');
	}

	const serverInfo: ServerInfo = await infoRequest.json();
	const serverSettings: ServerSettings = await settingsRequest.json();

	return { serverInfo, serverSettings };
};
