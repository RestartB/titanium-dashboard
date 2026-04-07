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

  throw redirect(
    302,
    `https://discord.com/oauth2/authorize?response_type=code&client_id=${DISCORD_CLIENT_ID}&scope=identify%20guilds&state=${state}&redirect_uri=${encodeURIComponent(`${event.url.origin}/auth/callback`)}`
  );
};
