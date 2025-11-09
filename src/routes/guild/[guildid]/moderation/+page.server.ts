import type { PageServerLoad } from './$types';
import type { ModerationConfigSchema } from '$lib/validators/moderation';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/moderation');
  const pageSettings: ModerationConfigSchema = await request.json();
  return { pageSettings };
};
