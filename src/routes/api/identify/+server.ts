import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { token } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({ cookies }) => {
	const titaniumToken = cookies.get('titanium_token');

	if (!titaniumToken) {
		throw error(401, 'Unauthorized: No token provided');
	}
	const tokenRecord = await db.select().from(token).where(eq(token.token, titaniumToken)).get();

	if (!tokenRecord) {
		throw error(401, 'Unauthorized: Invalid token');
	}

	const request = await fetch('https://discord.com/api/users/@me', {
		headers: {
			Authorization: `Bearer ${tokenRecord.discordToken}`
		}
	});

	if (!request.ok) {
		console.error('Failed to fetch user data from Discord:', await request.text());
		throw error(request.status, 'Failed to fetch user data from Discord');
	}

	const userData = await request.json();
	console.log("Identify")
	return json({ userData });
};
