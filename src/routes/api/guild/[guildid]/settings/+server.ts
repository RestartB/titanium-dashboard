import { error, json } from '@sveltejs/kit';
import { TITANIUM_API_URL } from '$env/static/private';

import { guildSettingsSchema } from '$lib/validators';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const request = await fetch(`${TITANIUM_API_URL}/guild/${event.locals.guildId}/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!request.ok) {
    console.error(request.statusText);
    error(request.status, 'Failed to fetch server settings from Titanium');
  }

  const data = await request.json();
  return json(data);
};

export const PUT: RequestHandler = async (event) => {
  const body = await event.request.json();

  const validationResult = guildSettingsSchema.safeParse(body);

  if (!validationResult.success) {
    console.error(validationResult.error);
    throw error(400, 'Invalid guild settings');
  }

  const putRequest = await fetch(`${TITANIUM_API_URL}/guild/${event.locals.guildId}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(validationResult.data)
  });

  if (!putRequest.ok) {
    console.error(putRequest.statusText);
    throw error(putRequest.status, 'Failed to update server settings on Titanium server');
  }

  return new Response(null, { status: 204 });
};
