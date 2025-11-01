import type { PageServerLoad } from './$types';
import type { ServerModerationSettings } from '$lib/interfaces/moderation';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/moderation');
  const pageSettings: ServerModerationSettings = await request.json();
  return { pageSettings };
};
