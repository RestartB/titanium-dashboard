import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { guildid } = params;

	if (!guildid) {
		throw error(400, 'Missing guild ID');
	}

	const request = await fetch(`http://127.0.0.1:5100/${guildid}/settings`, {
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

export const PUT: RequestHandler = async ({ params, request: req }) => {
	const { guildid } = params;
	const body = await req.json();

	if (!guildid) {
		throw error(400, 'Missing guild ID');
	}

	const putRequest = await fetch(`http://127.0.0.1:5100/${guildid}/settings`, {
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
