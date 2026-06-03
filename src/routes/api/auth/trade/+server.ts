import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { db } from '$lib/server/db';
import { token } from '$lib/server/db/schema';

import crypto from 'crypto';
import { encrypt } from '$lib/server/crypto';

import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, MODE } from '$env/static/private';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();

  if (!body || !body.code) {
    throw error(400, 'Authentication failed');
  }

  if (!body.state) {
    throw error(400, 'Authentication failed');
  }

  if (body.state !== cookies.get('titanium_state')) {
    throw error(400, 'Authentication failed');
  }

  cookies.delete('titanium_state', { path: '/' });

  // dynamically set redirect url when developing
  let redirectUri = DISCORD_REDIRECT_URI ?? '';
  if (MODE.toLowerCase() !== 'production') {
    try {
      const reqUrl = new URL(request.url);
      const redirectUrl = new URL(redirectUri);

      redirectUrl.protocol = reqUrl.protocol;
      redirectUrl.host = reqUrl.host;

      redirectUri = redirectUrl.toString();
    } catch (e) {
      console.error(e);
    }
  }

  const newRequest = await fetch('https://discord.com/api/v10/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID ?? '',
      client_secret: DISCORD_CLIENT_SECRET ?? '',
      grant_type: 'authorization_code',
      code: body.code ?? '',
      redirect_uri: redirectUri
    })
  });

  if (!newRequest.ok) {
    const errorData = await newRequest.text();
    console.error('Discord returned error when trading token: ', newRequest.status, newRequest.statusText, errorData);
    throw error(500, 'Authentication failed');
  }

  const data = await newRequest.json();
  const tokenData = crypto.randomBytes(16).toString('base64');

  const userRequest = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      Authorization: `Bearer ${data.access_token}`
    }
  });

  if (!userRequest.ok) {
    throw error(500, 'Failed to fetch user data from Discord');
  }

  const userData = await userRequest.json();
  const discordUserId = userData.id;

  const { encrypted: discordToken, iv: discordTokenIV, authTag: discordTokenAuthTag } = encrypt(data.access_token);

  await db.insert(token).values({
    token: tokenData,
    createdAt: new Date(),
    tokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),

    discordToken: discordToken,
    discordTokenIV: discordTokenIV,
    discordTokenAuthTag: discordTokenAuthTag,

    discordExpiresIn: data.expires_in,
    discordUserId: discordUserId
  });

  cookies.set('titanium_token', tokenData, {
    httpOnly: true,
    secure: MODE.toLowerCase() === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });

  return json({ success: true });
};
