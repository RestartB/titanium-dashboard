import type { PageServerLoad } from './$types';
import type { TagsConfigSchema } from '$lib/validators';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/tags');
  const pageSettings: TagsConfigSchema = await request.json();
  return { pageSettings };
};
