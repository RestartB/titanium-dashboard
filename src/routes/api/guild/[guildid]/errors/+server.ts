import { error, json } from '@sveltejs/kit';
import { TITANIUM_API_URL } from '$env/static/private';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  // Get limit and offset args
  const limit = Math.max(Math.min(Number(event.url.searchParams.get('limit') || 50), 100), 1);
  const offset = Math.max(Number(event.url.searchParams.get('offset') || 0), 0);

  const request = await fetch(
    `${TITANIUM_API_URL}/guild/${event.locals.guildId}/errors?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!request.ok) {
    error(request.status, 'Failed to fetch errors from Titanium');
  }

  const data = await request.json();
  return json(data);
};
