import type { PageServerLoad } from './$types';
import type { FireboardSettings } from '$lib/types/fireboard';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Get data
	const request = await fetch('/api/' + params.guildid + '/module/fireboard');
	const pageSettings: FireboardSettings = await request.json();
	return { pageSettings };
};
