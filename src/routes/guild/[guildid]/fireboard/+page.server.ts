import type { PageServerLoad } from './$types';
import type { FireboardSettings } from '$lib/types/fireboard';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildID + '/module/server_counters');
  const pageSettings: FireboardSettings = await request.json();
  return { pageSettings };
};
