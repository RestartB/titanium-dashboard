import type { PageServerLoad } from './$types';
import type { LoggingSettings } from '$lib/types/logging';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Get data
	const request = await fetch('/api/' + params.guildid + '/module/logging');
	const logging_info: LoggingSettings = await request.json();
	return { logging_info };
};
