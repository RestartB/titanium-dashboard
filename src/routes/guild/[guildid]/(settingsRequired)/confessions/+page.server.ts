import type { PageServerLoad } from './$types';
import type { ConfessionsConfigSchema } from '$lib/validators';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/confessions');
  const pageSettings: ConfessionsConfigSchema = await request.json();
  return { pageSettings };
};
