import { checkToken } from '$lib/helpers/token';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  return { tokenValid: await checkToken(event) };
};
