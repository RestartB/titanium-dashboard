import { error } from '@sveltejs/kit';
import { tagLinkLimit } from '$lib/server/limits';
import { TITANIUM_API_URL } from '$env/static/private';

import z from 'zod';

import type { PageServerLoad } from './$types';
import type { TagSessionData } from '$lib/interfaces/tags';

export const load: PageServerLoad = async (event) => {
  const submitKey = event.cookies.get('submitKey');
  if (!submitKey) {
    return { session: undefined };
  }

  if (await tagLinkLimit.isLimited(event)) error(429);

  const result = z.uuidv4().safeParse(event.params.key);
  if (!result.success) {
    error(400, 'Invalid session key');
  }

  const request = await fetch(`${TITANIUM_API_URL}/taglink/${event.params.key}/continue`, {
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
