import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { DISCORD_CLIENT_ID } from '$env/static/private';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const token = cookies.get('titanium_token');

  if (token) {
    throw redirect(302, '/');
  }

  // get redirect from url arg
  const redirectTo = url.searchParams.get('redirect');

  // date + random chars + redirect stored in base64
  const state = `${Date.now()}-${Math.random().toString(36).substring(2)}-${redirectTo ? btoa(encodeURIComponent(redirectTo)) : ''}`;
  cookies.set('titanium_state', state, {
    path: '/',
    sameSite: 'strict',
    secure: false,
    maxAge: 600,
    httpOnly: false
  });

  throw redirect(
    302,
    `https://discord.com/oauth2/authorize?response_type=code&client_id=${DISCORD_CLIENT_ID}&scope=identify%20guilds&state=${state}&redirect_uri=${encodeURIComponent(`${url.origin}/auth/callback`)}`
  );
};
