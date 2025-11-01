import type { PageServerLoad } from './$types';
import type { ErrorLogs } from '$lib/interfaces/serverInfo';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/errors');
  const errors: ErrorLogs = await request.json();
  return { errors };
};
