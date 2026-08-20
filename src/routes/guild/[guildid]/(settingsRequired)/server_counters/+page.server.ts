import type { PageServerLoad } from './$types';
import type { ServerCountersConfigSchema } from '$lib/validators/serverCounters';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/server_counters');
  const pageSettings: ServerCountersConfigSchema = await request.json();
  return { pageSettings };
};
