import { redirect } from '@sveltejs/kit';
import { checkToken } from '$lib/server/token';

import type { RequestHandler } from './$types';

import { DISCORD_CLIENT_ID, MODE } from '$env/static/private';

export const GET: RequestHandler = async (event) => {
  if ((await checkToken(event)).token) {
    throw redirect(302, '/');
  }

  // get redirect from url arg
  const redirectTo = event.url.searchParams.get('redirect');

  // date - random chars - redirect stored in base64
  const state = `${Date.now()}-${Math.random().toString(36).substring(2)}-${redirectTo ? btoa(encodeURIComponent(redirectTo)) : ''}`;
  event.cookies.set('titanium_state', state, {
    path: '/',
    sameSite: 'strict',
    secure: MODE.toLowerCase() === 'production',
    maxAge: 600,
    httpOnly: false
  });

  const authorizeUrl = new URL('https://discord.com/oauth2/authorize');
  authorizeUrl.search = new URLSearchParams({
    response_type: 'code',
    client_id: DISCORD_CLIENT_ID,
    scope: 'identify guilds',
    state,
    redirect_uri: `${event.url.origin}/auth/callback`
  }).toString();

  throw redirect(302, authorizeUrl.toString());
};
