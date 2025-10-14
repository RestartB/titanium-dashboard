import type { PageServerLoad } from './$types';
import type { FireboardSettings } from '$lib/types/fireboard';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildID + '/module/fireboard');
  const pageSettings: FireboardSettings = await request.json();
  return { pageSettings };
};
