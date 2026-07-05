import type { PageServerLoad } from './$types';
import type { RepConfigSchema } from '$lib/validators';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/rep');
  const pageSettings: RepConfigSchema = await request.json();
  return { pageSettings };
};
