import { error, json } from '@sveltejs/kit';
import { TITANIUM_API_URL } from '$env/static/private';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const request = await fetch(`${TITANIUM_API_URL}/guild/${event.locals.guildId}/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!request.ok) {
    error(request.status, 'Failed to fetch server info from Titanium');
  }

  const data = await request.json();
  return json(data);
};
