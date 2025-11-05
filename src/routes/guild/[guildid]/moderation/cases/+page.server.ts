import type { PageServerLoad } from './$types';
import type { CasesResponse } from '$lib/interfaces/moderation';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  
  const request = await fetch('/api/guild/' + locals.guildId + '/cases');
  const cases: CasesResponse = await request.json();
  return { cases };
};
