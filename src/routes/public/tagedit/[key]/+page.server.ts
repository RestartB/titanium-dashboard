import { TITANIUM_API_URL } from '$env/static/private';

import type { PageServerLoad } from './$types';
import type { TagSessionData } from '$lib/interfaces/tags';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const submitKey = cookies.get('submitKey');
  if (!submitKey) {
    console.log('No submit key');
    return { session: undefined };
  }

  const request = await fetch(`${TITANIUM_API_URL}/taglink/${params.key}/continue`, {
    headers: {
      'Submit-Key': submitKey
    }
  });

  if (!request.ok) {
    console.error('Failed to continue tag edit session: ', request.status);
    return { session: undefined };
  }
  const session: TagSessionData = await request.json();
  console.log('session resumed');

  return { session };
};
