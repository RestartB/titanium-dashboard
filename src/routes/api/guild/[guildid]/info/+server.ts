import { error, json } from '@sveltejs/kit';
import { TITANIUM_API_URL } from '$env/static/private';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  try {
    const request = await fetch(`${TITANIUM_API_URL}/guild/${event.locals.guildId}/info?user=${event.locals.discordId}`, {
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
  } catch (err) {
    if (err instanceof TypeError) {
      console.error('Network error:', err.message);
      throw error(503, 'Titanium is unavailable. Please try again later.');
    }

    throw err;
  }
};
