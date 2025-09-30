import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const request = await fetch('https://discord.com/api/users/@me', {
		headers: {
			Authorization: `Bearer ${locals.discordToken}`
		}
	});

	if (!request.ok) {
		console.error('Failed to fetch user data from Discord:', await request.text());
		throw error(request.status, 'Failed to fetch user data from Discord');
	}

	const userData = await request.json();
	return json({ userData });
};
