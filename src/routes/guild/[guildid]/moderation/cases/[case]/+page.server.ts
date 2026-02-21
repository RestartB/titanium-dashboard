import type { PageServerLoad } from './$types';
import type { ModerationCase } from '$lib/interfaces/moderation';

export const load: PageServerLoad = async ({ locals, params, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/cases/' + params.case);
  const caseData: ModerationCase = await request.json();
  return { caseData };
};
