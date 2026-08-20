import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
  const parentData = await parent();
  if (!parentData.serverSettings) {
    redirect(302, '/');
  }

  const serverSettings = parentData.serverSettings;
  return { serverSettings };
};
