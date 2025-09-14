import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { guildid } = params;

	if (!guildid) {
		throw error(400, 'Missing guild ID');
	}

	const request = await fetch(`http://localhost:5000/${guildid}/info`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!request.ok) {
		error(request.status, 'Failed to fetch server info from Titanium');
	}

	const data = await request.json();
	return json(data);
};
