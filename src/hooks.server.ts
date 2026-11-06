import { redirect, json, error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

import { checkToken, deleteToken } from '$lib/server/token';
import { apiLimit } from '$lib/server/limits';
import { isGuildId, isSafePathSegment } from '$lib/helpers/path';
import { dev } from '$app/environment';

import { TITANIUM_API_URL } from '$env/static/private';

interface PermCacheEntry {
  expiresAt: number;
  data: {
    dashboard_manager: boolean;
    case_manager: boolean;
  };
}
const permsCache = new Map<string, PermCacheEntry>();

const caseManagerRoutes = new Set<string>([
  '/api/guild/[guildid]',
  '/api/guild/[guildid]/cases',
  '/api/guild/[guildid]/cases/[case]',
  '/guild/[guildid]/moderation/cases',
  '/guild/[guildid]/moderation/cases/[case]'
]);

export const handle: Handle = async ({ event, resolve }) => {
  console.log(`Handling request for ${event.url.pathname}`);

  if (!dev) {
    event.setHeaders({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Strict-Transport-Security': 'max-age=604800; includeSubDomains'
    });
  }

  // check the route rather than the pathname
  // stops attacks via url encoding as sveltekit doesn't remove encoded characters in these cases
  const routeId = event.route.id ?? '';
  const isApi = routeId.startsWith('/api/');
  const isGuildApi = routeId === '/api/guild/[guildid]' || routeId.startsWith('/api/guild/[guildid]/');
  const isGuildRoute =
    isGuildApi || routeId === '/guild/[guildid]' || routeId.startsWith('/guild/[guildid]/');
  const guildId = event.params.guildid;

  if (Object.values(event.params).some((value) => !isSafePathSegment(value))) {
    throw error(400, 'Invalid route parameter');
  }

  if (guildId !== undefined && !isGuildId(guildId)) {
    throw error(400, 'Invalid Guild ID');
  }

  // ignore auth for certain endpoints
  if (
    event.isRemoteRequest ||
    routeId === '/' ||
    routeId.startsWith('/public/') ||
    routeId.startsWith('/auth/') ||
    routeId.startsWith('/api/auth/') ||
    routeId.startsWith('/emojis/')
  ) {
    const response = await resolve(event);
    return response;
  }

  // token present check
  const { token: titaniumToken, expired } = await checkToken(event);
  if (!titaniumToken || expired) {
    console.debug('Invalid / missing Titanium token');

    // delete expired token if there is one
    if (titaniumToken && expired) {
      await deleteToken(titaniumToken.token, titaniumToken.discordToken);
    }

    if (isApi) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    event.cookies.delete('titanium_token', { path: '/' });
    event.cookies.delete('titanium_state', { path: '/' });
    return redirect(302, '/auth/login?redirect=' + encodeURIComponent(event.url.pathname));
  }

  event.locals.token = titaniumToken.token;
  event.locals.discordToken = titaniumToken.discordToken;
  event.locals.discordId = titaniumToken.discordUserId;

  // rate limiting
  if (isGuildApi) {
    const status = await apiLimit.check(event);
    if (status.limited) throw error(429, 'Too many requests');
  }

  // guild id / permissions check
  if (isGuildRoute) {
    if (!isGuildId(guildId)) {
      console.debug('No guild id');
      if (isApi) {
        return json({ error: 'Missing Guild ID' }, { status: 400 });
      }

      return redirect(302, '/');
    }

    try {
      const cacheKey = `${guildId}-${event.locals.discordId}`;
      const cached = permsCache.get(cacheKey);
      let permCheck;

      if (cached && cached.expiresAt > Date.now()) {
        permCheck = cached.data;
      } else {
        const permCheckRequest = await fetch(
          `${TITANIUM_API_URL}/guild/` + guildId + '/perms/' + event.locals.discordId
        );

        if (!permCheckRequest.ok) {
          if (permCheckRequest.status === 404) {
            console.debug('Guild not found');
            if (isApi) {
              return json({ error: 'Guild not found' }, { status: 404 });
            }

            return redirect(302, '/');
          }

          console.debug('Failed to fetch guild permissions from Titanium');
          if (isApi) {
            return json(
              { error: 'Failed to fetch guild permissions from Titanium' },
              { status: permCheckRequest.status }
            );
          }

          return redirect(302, '/');
        }

        permCheck = await permCheckRequest.json();
        permsCache.set(cacheKey, { expiresAt: Date.now() + 60000, data: permCheck });
      }

      event.locals.dashboard_manager = permCheck.dashboard_manager;
      event.locals.case_manager = permCheck.case_manager;
    } catch (err) {
      if (err instanceof TypeError) {
        console.error('Network error:', err.message);
        throw error(503, 'Titanium is unavailable. Please try again later.');
      }

      throw err;
    }

    if (!event.locals.dashboard_manager && !event.locals.case_manager) {
      console.debug('Insufficient guild permissions');
      if (isApi) {
        return json({ error: 'Insufficient Permissions' }, { status: 403 });
      }

      return redirect(302, '/');
    } else if (!caseManagerRoutes.has(routeId) && !event.locals.dashboard_manager) {
      if (isApi) {
        return json({ error: 'Insufficient Permissions' }, { status: 403 });
      }
      console.log(`Not a case manager whitelisted link, redirecting (${event.url.href})`);
      return redirect(302, `/guild/${guildId}/moderation/cases`);
    }

    event.locals.guildId = guildId;
  }

  const response = await resolve(event);
  return response;
};
