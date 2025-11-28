import type { PageServerLoad } from './$types';
import type { GuildPermissionsSchema } from '$lib/validators/settings';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/perms');
  const pageSettings: GuildPermissionsSchema = await request.json();
  return { pageSettings };
};
