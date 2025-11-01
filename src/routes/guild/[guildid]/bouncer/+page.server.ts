import type { PageServerLoad } from './$types';
import type { BouncerSettings } from '$lib/interfaces/bouncer';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/bouncer');
  const pageSettings: BouncerSettings = await request.json();
  return { pageSettings };
};
