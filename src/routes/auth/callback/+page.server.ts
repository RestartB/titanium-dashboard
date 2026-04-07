import { checkToken } from '$lib/server/token';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  return { tokenValid: (await checkToken(event)).token ? true : false };
};
