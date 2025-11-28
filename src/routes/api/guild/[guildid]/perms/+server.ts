import { error, json } from '@sveltejs/kit';
import { guildPermissionsSchema } from '$lib/validators';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const request = await fetch(`http://127.0.0.1:5100/guild/${event.locals.guildId}/perms`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!request.ok) {
    console.error(request.statusText);
    error(request.status, 'Failed to fetch permissions from Titanium server');
  }

  const data = await request.json();
  return json(data);
};

export const PUT: RequestHandler = async (event) => {
  const body = await event.request.json();

  const validationResult = guildPermissionsSchema.safeParse(body);

  if (!validationResult.success) {
    console.error(validationResult.error);
    throw error(400, 'Invalid guild settings');
  }

  const putRequest = await fetch(`http://127.0.0.1:5100/guild/${event.locals.guildId}/perms`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(validationResult.data)
  });

  if (!putRequest.ok) {
    console.error(putRequest.statusText);
    throw error(putRequest.status, 'Failed to update permissions on Titanium server');
  }

  return new Response(null, { status: 204 });
};
