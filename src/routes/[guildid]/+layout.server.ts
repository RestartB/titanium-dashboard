import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import type { ServerInfo } from '$lib/types/server_info';
import type { ServerSettings } from '$lib/types/server_settings';

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

	const server_info: ServerInfo = await infoRequest.json();
	const server_settings: ServerSettings = await settingsRequest.json();

	return { server_info, server_settings };
};
