import { redirect, json, error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { token } from '$lib/server/db/schema';

import { apiLimit } from '$lib/limits';

export const handle: Handle = async ({ event, resolve }) => {
  if (
    event.url.pathname === '/' ||
    (event.url.pathname.startsWith('/auth') && event.url.pathname !== '/auth/logout') ||
    event.url.pathname.startsWith('/api/auth')
  ) {
    const response = await resolve(event);
    return response;
  }

  const titaniumToken = event.cookies.get('titanium_token');
  if (!titaniumToken) {
    if (event.url.pathname.startsWith('/api')) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('No titanium token');
    return redirect(302, '/');
  }

  const tokenRecord = await db.select().from(token).where(eq(token.token, titaniumToken)).get();
  if (!tokenRecord) {
    event.cookies.delete('titanium_token', { path: '/' });

    if (event.url.pathname.startsWith('/api')) {
      return json({ error: 'Invalid Token' }, { status: 401 });
    }

    console.log('Invalid titanium token');
    return redirect(302, '/');
  }

  event.locals.token = titaniumToken;
  event.locals.discordToken = tokenRecord.discordToken;
  event.locals.discordID = tokenRecord.discordUserId;

  if (event.url.pathname.startsWith('/api/guild/')) {
    await apiLimit.cookieLimiter?.preflight(event);
    const status = await apiLimit.check(event);
    if (status.limited)
      throw error(429, `Too many requests, please try again after ${status.retryAfter} seconds`);
  }

  if (event.url.pathname.startsWith('/guild/') || event.url.pathname.startsWith('/api/guild/')) {
    const guildid = event.params.guildid;

    if (!guildid) {
      if (event.url.pathname.startsWith('/api')) {
        return json({ error: 'Missing Guild ID' }, { status: 400 });
      }

      console.log('No guild id');
      return redirect(302, '/');
    }

    if (isNaN(Number(guildid))) {
      if (event.url.pathname.startsWith('/api')) {
        return json({ error: 'Invalid Guild ID' }, { status: 400 });
      }

      console.log('Invalid guild id');
      return redirect(302, '/');
    }

    const permCheckRequest = await fetch(
      'http://localhost:5100/guild/' + event.params.guildid + '/perms/' + event.locals.discordID,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!permCheckRequest.ok) {
      if (permCheckRequest.status === 404) {
        if (event.url.pathname.startsWith('/api')) {
          return json({ error: 'Guild not found' }, { status: 404 });
        }

        console.log('Guild not found');
        return redirect(302, '/');
      }

      if (event.url.pathname.startsWith('/api')) {
        return json(
          { error: 'Failed to fetch guild permissions from Titanium' },
          { status: permCheckRequest.status }
        );
      }

      console.log('Failed to fetch guild permissions from Titanium');
      return redirect(302, '/');
    }

    const permCheck = await permCheckRequest.json();

    event.locals.dashboard_manager = permCheck.dashboard_manager;
    event.locals.case_manager = permCheck.case_manager;

    if (!permCheck.dashboard_manager && !permCheck.case_manager) {
      if (event.url.pathname.startsWith('/api')) {
        return json({ error: 'Insufficient Permissions' }, { status: 403 });
      }

      console.log('Insufficient guild permissions');
      return redirect(302, '/');
    }

    event.locals.guildId = guildid;
  }

  const response = await resolve(event);
  return response;
};
