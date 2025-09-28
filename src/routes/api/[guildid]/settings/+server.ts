import { error, json } from '@sveltejs/kit';
import { apiLimit } from '$lib/limits';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	await apiLimit.cookieLimiter?.preflight(event);
	const status = await apiLimit.check(event);
	if (status.limited)
		throw error(429, `Too many requests, please try again after ${status.retryAfter} seconds`);
	const { guildid } = event.params;

	if (!guildid) {
		throw error(400, 'Missing guild ID');
	}

	const request = await fetch(`http://127.0.0.1:5100/guild/${guildid}/settings`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!request.ok) {
		error(request.status, 'Failed to fetch server settings from Titanium');
	}

	const data = await request.json();
	return json(data);
};

export const PUT: RequestHandler = async (event) => {
	await apiLimit.cookieLimiter?.preflight(event);
	if (await apiLimit.isLimited(event)) throw error(429);
	const { guildid } = event.params;
	const body = await event.request.json();

	if (!guildid) {
		throw error(400, 'Missing guild ID');
	}

	const putRequest = await fetch(`http://127.0.0.1:5100/guild/${guildid}/settings`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	if (!putRequest.ok) {
		error(putRequest.status, 'Failed to update server settings on Titanium server');
	}

	return new Response(null, { status: 204 });
};
