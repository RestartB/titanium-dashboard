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
    console.log('No titanium token');
    if (event.url.pathname.startsWith('/api')) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    return redirect(302, '/');
  }

  const tokenRecord = await db.select().from(token).where(eq(token.token, titaniumToken)).get();
  if (!tokenRecord) {
    console.log('Invalid titanium token');
    event.cookies.delete('titanium_token', { path: '/' });

    if (event.url.pathname.startsWith('/api')) {
      return json({ error: 'Invalid Token' }, { status: 401 });
    }

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
      console.log('No guild id');
      if (event.url.pathname.startsWith('/api')) {
        return json({ error: 'Missing Guild ID' }, { status: 400 });
      }

      const response = await resolve(event);
      return response;
    }

    if (isNaN(Number(guildid))) {
      console.log('Invalid guild id');
      if (event.url.pathname.startsWith('/api')) {
        return json({ error: 'Invalid Guild ID' }, { status: 400 });
      }

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
        console.log('Guild not found');
        if (event.url.pathname.startsWith('/api')) {
          return json({ error: 'Guild not found' }, { status: 404 });
        }

        return redirect(302, '/');
      }

      console.log('Failed to fetch guild permissions from Titanium');
      if (event.url.pathname.startsWith('/api')) {
        return json(
          { error: 'Failed to fetch guild permissions from Titanium' },
          { status: permCheckRequest.status }
        );
      }

      return redirect(302, '/');
    }

    const permCheck = await permCheckRequest.json();

    event.locals.dashboard_manager = permCheck.dashboard_manager;
    event.locals.case_manager = permCheck.case_manager;

    if (!permCheck.dashboard_manager && !permCheck.case_manager) {
      console.log('Insufficient guild permissions');
      if (event.url.pathname.startsWith('/api')) {
        return json({ error: 'Insufficient Permissions' }, { status: 403 });
      }

      return redirect(302, '/');
    }

    event.locals.guildId = guildid;
  }

  const response = await resolve(event);
  return response;
};
