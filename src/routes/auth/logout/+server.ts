import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '$env/static/private';

import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { token } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({ locals, cookies }) => {
	if (!locals.token) {
		console.log('No token found', locals);
		return redirect(302, '/');
	}

	if (locals.discordToken) {
		const newRequest = await fetch('https://discord.com/api/oauth2/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: DISCORD_CLIENT_ID ?? '',
				client_secret: DISCORD_CLIENT_SECRET ?? '',
				token: locals.discordToken,
				token_type_hint: 'access_token'
			})
		});

		if (!newRequest.ok) {
			console.log(newRequest.status, 'Failed to revoke token');
		}

		console.log('Revoked Discord token');
	}

	await db.delete(token).where(eq(token.token, locals.token)).run();

	cookies.delete('titanium_token', { path: '/' });
	cookies.delete('titanium_state', { path: '/' });

	console.log('Deleted cookies');

	return redirect(302, '/');
};
