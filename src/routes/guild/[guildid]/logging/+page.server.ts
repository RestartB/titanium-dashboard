import type { PageServerLoad } from './$types';
import type { LoggingSettings } from '$lib/types/logging';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildID + '/module/logging');
  const pageSettings: LoggingSettings = await request.json();
  return { pageSettings };
};
