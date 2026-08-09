import type { PageServerLoad } from './$types';
import type { CasesResponse } from '$lib/interfaces/moderation';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/cases');
  if (request.status === 403) {
    // moderation is disabled
    return;
  }

  const cases: CasesResponse = await request.json();
  return { cases };
};
