import type { PageServerLoad } from './$types';
import type { AutomodSettings } from '$lib/types/automod';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildID + '/module/automod');
  const pageSettings: AutomodSettings = await request.json();
  return { pageSettings };
};
