import type { PageServerLoad } from './$types';
import type { FireboardConfigSchema } from '$lib/validators/fireboard';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/fireboard');
  const pageSettings: FireboardConfigSchema = await request.json();
  return { pageSettings };
};
