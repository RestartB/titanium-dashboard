import { error, json } from '@sveltejs/kit';
import { TITANIUM_API_URL } from '$env/static/private';

import type { RequestHandler } from './$types';
import * as validators from '$lib/validators';

export const GET: RequestHandler = async (event) => {
  const { module } = event.params;

  if (!module) {
    throw error(400, 'Missing module name');
  }

  const request = await fetch(`${TITANIUM_API_URL}/guild/${event.locals.guildId}/module/${module}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!request.ok) {
    console.error(request.statusText);
    error(request.status, 'Failed to fetch server info from Titanium server');
  }

  const data = await request.json();
  return json(data);
};

export const PUT: RequestHandler = async (event) => {
  const { module } = event.params;
  const body = await event.request.json();

  if (!module) {
    throw error(400, 'Missing module name');
  }

  const schemaKey = module + 'ConfigSchema';
  const validator = validators[schemaKey as keyof typeof validators];

  if (!validator) {
    throw error(400, 'Invalid module name');
  }

  const validationResult = validator.safeParse(body);

  if (!validationResult.success) {
    console.error(validationResult.error);
    throw error(400, 'Invalid module config');
  }

  const putRequest = await fetch(`${TITANIUM_API_URL}/guild/${event.locals.guildId}/module/${module}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(validationResult.data)
  });

  if (!putRequest.ok) {
    const errorData = await putRequest.json();
    console.error(putRequest.statusText, errorData);
    error(putRequest.status, 'Failed to update server info on Titanium server');
  }

  return new Response(null, { status: 204 });
};
