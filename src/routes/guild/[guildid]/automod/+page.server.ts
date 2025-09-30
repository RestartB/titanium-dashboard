import type { PageServerLoad } from './$types';
import type { AutomodSettings } from '$lib/types/automod';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Get data
	const request = await fetch('/api/' + params.guildid + '/module/automod');
	const pageSettings: AutomodSettings = await request.json();
	return { pageSettings };
};
