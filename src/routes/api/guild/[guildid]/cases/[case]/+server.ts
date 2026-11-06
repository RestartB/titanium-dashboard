import { error, json } from '@sveltejs/kit';
import { TITANIUM_API_URL } from '$env/static/private';
import { isGuildId, isSafePathSegment } from '$lib/helpers/path';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params, fetch }) => {
  if (!isGuildId(locals.guildId) || locals.guildId !== params.guildid) {
    throw error(403, 'Guild access required');
  }
  if (!locals.case_manager && !locals.dashboard_manager) {
    throw error(403, 'Insufficient Permissions');
  }
  if (!isSafePathSegment(params.case)) {
    throw error(400, 'Invalid case ID');
  }

  try {
    const request = await fetch(`${TITANIUM_API_URL}/guild/${locals.guildId}/cases/${encodeURIComponent(params.case)}`, {
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
