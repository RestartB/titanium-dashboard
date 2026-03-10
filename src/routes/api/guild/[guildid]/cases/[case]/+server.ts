import { error, json } from '@sveltejs/kit';
import { TITANIUM_API_URL } from '$env/static/private';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params, fetch }) => {
  try {
    const request = await fetch(`${TITANIUM_API_URL}/guild/${locals.guildId}/cases/${params.case}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!request.ok) {
      error(request.status, 'Failed to fetch case from Titanium');
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
