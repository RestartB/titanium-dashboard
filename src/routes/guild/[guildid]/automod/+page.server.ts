import type { PageServerLoad } from './$types';
import type { AutomodConfigSchema } from '$lib/validators/automod';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/automod');
  const pageSettings: AutomodConfigSchema = await request.json();
  return { pageSettings };
};
