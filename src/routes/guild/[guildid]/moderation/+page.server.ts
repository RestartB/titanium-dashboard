import type { PageServerLoad } from './$types';
import type { ServerModerationSettings } from '$lib/types/moderation';

export const load: PageServerLoad = async ({ params, fetch }) => {
  // Get data
  const request = await fetch('/api/' + params.guildid + '/module/moderation');
  const pageSettings: ServerModerationSettings = await request.json();
  return { pageSettings };
};
