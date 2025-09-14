import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import type { ServerInfo } from '$lib/types/server_info';

export const load: LayoutServerLoad = async ({ params, fetch }) => {
	// Get data
	const request = await fetch('/api/' + params.guildid);

	if (!request.ok) {
		error(request.status, 'Failed to fetch server info from Titanium server');
	}

	const server_info: ServerInfo = await request.json();
	return { server_info };
};
