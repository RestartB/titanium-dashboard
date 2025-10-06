import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const request = await fetch(`http://127.0.0.1:5100/guild/${event.locals.guildID}/info`, {
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
