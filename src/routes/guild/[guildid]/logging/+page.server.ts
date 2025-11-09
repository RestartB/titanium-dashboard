import type { PageServerLoad } from './$types';
import type { LoggingConfigSchema } from '$lib/validators/logging';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/logging');
  const pageSettings: LoggingConfigSchema = await request.json();
  return { pageSettings };
};
