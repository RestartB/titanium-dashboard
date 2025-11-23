import type { PageServerLoad } from './$types';
import type { ConfessionConfigSchema } from '$lib/validators';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/confessions');
  const pageSettings: ConfessionConfigSchema = await request.json();
  return { pageSettings };
};
