import { redirect, json } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { token } from '$lib/server/db/schema';

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

		return redirect(302, '/');
	}

	const tokenRecord = await db.select().from(token).where(eq(token.token, titaniumToken)).get();
	if (!tokenRecord) {
		event.cookies.delete('titanium_token', { path: '/' });

		if (event.url.pathname.startsWith('/api')) {
			return json({ error: 'Invalid Token' }, { status: 401 });
		}

		return redirect(302, '/');
	}

	event.locals.token = titaniumToken;
	event.locals.discordToken = tokenRecord.discordToken;
	event.locals.discordID = tokenRecord.discordUserId;

	const response = await resolve(event);
	return response;
};
