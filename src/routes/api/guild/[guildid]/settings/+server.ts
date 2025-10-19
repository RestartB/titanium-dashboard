import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const request = await fetch(`http://127.0.0.1:5100/guild/${event.locals.guildId}/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!request.ok) {
    error(request.status, 'Failed to fetch server settings from Titanium');
  }

  const data = await request.json();
  return json(data);
};

export const PUT: RequestHandler = async (event) => {
  const body = await event.request.json();

  const putRequest = await fetch(`http://127.0.0.1:5100/guild/${event.locals.guildId}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!putRequest.ok) {
    error(putRequest.status, 'Failed to update server settings on Titanium server');
  }

  return new Response(null, { status: 204 });
};
