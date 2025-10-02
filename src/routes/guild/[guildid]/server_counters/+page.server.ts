import type { PageServerLoad } from './$types';
import type { ServerCounterSettings } from '$lib/types/server_counters';

export const load: PageServerLoad = async ({ params, fetch }) => {
  // Get data
  const request = await fetch('/api/' + params.guildid + '/module/server_counters');
  const pageSettings: ServerCounterSettings = await request.json();
  return { pageSettings };
};
