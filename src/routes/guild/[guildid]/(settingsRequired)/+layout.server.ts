import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
  const parentData = await parent();
  if (!parentData.serverInfo || !parentData.serverSettings) {
    redirect(302, '/');
  }

  const serverInfo = parentData.serverInfo;
  const serverSettings = parentData.serverSettings;
  return { serverInfo, serverSettings };
};
