import { error, json } from '@sveltejs/kit';
import { apiLimit } from '$lib/limits';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	await apiLimit.cookieLimiter?.preflight(event);
	const status = await apiLimit.check(event);
	if (status.limited)
		throw error(429, `Too many requests, please try again after ${status.retryAfter} seconds`);
	const { guildid, module } = event.params;

	if (!guildid || !module) {
		throw error(400, 'Missing guild ID or module name');
	}

	const request = await fetch(`http://127.0.0.1:5100/guild/${guildid}/module/${module}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!request.ok) {
		error(request.status, 'Failed to fetch server info from Titanium server');
	}

	const data = await request.json();
	return json(data);
};

export const PUT: RequestHandler = async ({ params, request: req }) => {
	const { guildid, module } = params;
	const body = await req.json();

	if (!guildid || !module) {
		throw error(400, 'Missing guild ID or module name');
	}

	const putRequest = await fetch(`http://127.0.0.1:5100/guild/${guildid}/module/${module}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	if (!putRequest.ok) {
		const errorData = await putRequest.json();
		error(putRequest.status, errorData || 'Failed to update server info on Titanium server');
	}

	return new Response(null, { status: 204 });
};
