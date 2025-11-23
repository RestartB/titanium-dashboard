import type { PageServerLoad } from './$types';
import type { LeaderboardConfigSchema } from '$lib/validators';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/leaderboard');
  const pageSettings: LeaderboardConfigSchema = await request.json();
  return { pageSettings };
};
