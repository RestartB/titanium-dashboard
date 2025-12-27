import { redirect, json, error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { token } from '$lib/server/db/schema';

import { apiLimit } from '$lib/limits';

export const handle: Handle = async ({ event, resolve }) => {
  console.log(`Handling request for ${event.url.pathname}`);

  event.setHeaders({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Strict-Transport-Security': 'max-age=604800; includeSubDomains'
  });

  const pathParts = event.url.pathname.split('/');
  const guildIndex = pathParts.indexOf('guild');
  const guildId = guildIndex !== -1 ? pathParts[guildIndex + 1] : event.params.guildid;

  // ignore auth for certain endpoints
  if (
    event.url.pathname === '/' ||
    (event.url.pathname.startsWith('/auth') && event.url.pathname !== '/auth/logout') ||
    event.url.pathname.startsWith('/api/auth') ||
    event.url.pathname.startsWith('/emojis')
  ) {
    const response = await resolve(event);
    return response;
  }

  // token present check
  const titaniumToken = event.cookies.get('titanium_token');
  if (!titaniumToken) {
    console.log('No titanium token');
    if (event.url.pathname.startsWith('/api')) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    return redirect(302, '/auth/login?redirect=' + encodeURIComponent(event.url.pathname));
  }

  // token valid check
  const tokenRecord = await db.select().from(token).where(eq(token.token, titaniumToken)).get();
  if (!tokenRecord) {
    console.log('Invalid Titanium token');
    event.cookies.delete('titanium_token', { path: '/' });

    if (event.url.pathname.startsWith('/api')) {
      return json({ error: 'Invalid Token' }, { status: 401 });
    }

    return redirect(302, '/auth/login?redirect=' + encodeURIComponent(event.url.pathname));
  }

  event.locals.token = titaniumToken;
  event.locals.discordToken = tokenRecord.discordToken;
  event.locals.discordId = tokenRecord.discordUserId;

  // rate limiting
  if (event.url.pathname.startsWith('/api/guild/')) {
    await apiLimit.cookieLimiter?.preflight(event);
    const status = await apiLimit.check(event);
    if (status.limited) throw error(429, `Too many requests, please try again after ${status.retryAfter} seconds`);
  }

  // guild id / permissions check
  if (event.url.pathname.startsWith('/guild/') || event.url.pathname.startsWith('/api/guild/')) {
    if (!guildId) {
      console.log('No guild id');
      if (event.url.pathname.startsWith('/api')) {
        return json({ error: 'Missing Guild ID' }, { status: 400 });
      }

      const response = await resolve(event);
      return response;
    }

    if (isNaN(Number(guildId))) {
      console.log('Invalid guild id');
      if (event.url.pathname.startsWith('/api')) {
        return json({ error: 'Invalid Guild ID' }, { status: 400 });
      }

      return redirect(302, '/');
    }

    const permCheckRequest = await fetch(
      'http://localhost:5100/guild/' + guildId + '/perms/' + event.locals.discordId,
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
        return json({ error: 'Failed to fetch guild permissions from Titanium' }, { status: permCheckRequest.status });
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
    } else if (
      event.url.pathname === `/api/guild/${guildId}` ||
      event.url.pathname === `/api/guild/${guildId}/settings` ||
      event.url.pathname === `/api/guild/${guildId}/cases` ||
      event.url.pathname === `/guild/${guildId}/moderation/cases` ||
      event.url.pathname.startsWith(`/guild/${guildId}/moderation/cases/`)
    ) {
      if (!permCheck.case_manager && !permCheck.dashboard_manager) {
        return redirect(302, '/');
      }
    } else if (!permCheck.dashboard_manager) {
      return redirect(302, `/guild/${guildId}/moderation/cases`);
    }

    event.locals.guildId = guildId;
  }

  const response = await resolve(event);
  return response;
};
