import { error, json } from '@sveltejs/kit';
import { apiLimit } from '$lib/limits';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  await apiLimit.cookieLimiter?.preflight(event);
  const status = await apiLimit.check(event);
  if (status.limited) error(429, `Too many requests`);
  const { guildid } = event.params;

  if (!guildid) {
    throw error(400, 'Missing guild ID');
  }

  const request = await fetch(`http://127.0.0.1:5100/guild/${guildid}/info`, {
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
