import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { token } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, cookies }) => {
  const request = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      Authorization: `Bearer ${locals.discordToken}`
    }
  });

  if (request.status === 401) {
    if (locals.token) {
      await db.delete(token).where(eq(token.token, locals.token)).run();
      cookies.delete('titanium_token', { path: '/' });
    }
    throw error(401, 'Unauthorized');
  }

  if (!request.ok) {
    console.error('Failed to fetch user data from Discord:', await request.text());
    throw error(request.status, 'Failed to fetch user data from Discord');
  }

  const userData = await request.json();
  return json({ userData });
};
