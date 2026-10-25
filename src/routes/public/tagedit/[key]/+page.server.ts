import { continueEditSession } from '$lib/remote/tags.remote';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const submitKey = cookies.get('submitKey');
  if (!submitKey) {
    return { session: undefined };
  }

  try {
    const data = await continueEditSession({ pageKey: params.key, submitKey });
    return { session: data };
  } catch {
    return { session: undefined };
  }
};
