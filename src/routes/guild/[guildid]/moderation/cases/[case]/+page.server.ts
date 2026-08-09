import type { PageServerLoad } from './$types';
import type { ModerationCase } from '$lib/interfaces/moderation';

export const load: PageServerLoad = async ({ locals, params, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/cases/' + params.case);
  if (request.status === 403) {
    // moderation is disabled
    return;
  }

  const caseData: ModerationCase = await request.json();
  return { caseData };
};
