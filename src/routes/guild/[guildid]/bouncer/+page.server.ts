import type { PageServerLoad } from './$types';
import type {BouncerConfigSchema } from '$lib/validators/bouncer';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/bouncer');
  const pageSettings: BouncerConfigSchema = await request.json();
  return { pageSettings };
};
