import type { PageServerLoad } from './$types';
import type { ServerCounterSettings } from '$lib/interfaces/serverCounters';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/server_counters');
  const pageSettings: ServerCounterSettings = await request.json();
  return { pageSettings };
};
