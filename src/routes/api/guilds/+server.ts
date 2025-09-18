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
		console.error('Invalid token:', titaniumToken);
		throw error(401, 'Unauthorized: Invalid token');
	}

	const request = await fetch('https://discord.com/api/users/@me/guilds', {
		headers: {
			Authorization: `Bearer ${tokenRecord.discordToken}`
		}
	});

	if (!request.ok) {
		console.error('Failed to fetch guilds from Discord:', await request.text());
		throw error(request.status, 'Failed to fetch guilds from Discord');
	}

	const guildData = await request.json();
	const guilds = guildData.filter((guild: { permissions: string }) => {
		const permissions = parseInt(guild.permissions);
		return permissions & 0x20 || permissions & 0x8;
	});

	const mutualRequest = await fetch(
		`http://127.0.0.1:5100/user/${tokenRecord.discordUserId}/guilds`
	);

	if (!mutualRequest.ok) {
		console.error('Failed to fetch mutual guilds:', await mutualRequest.text());
		throw error(mutualRequest.status, 'Failed to fetch mutual guilds');
	}

	const mutualGuildIDs = await mutualRequest.json();

	const nonMutualGuilds = guilds.filter(
		(guild: { id: string }) => !mutualGuildIDs.includes(guild.id)
	);
	const mutualGuilds = guilds.filter((guild: { id: string }) => mutualGuildIDs.includes(guild.id));

	return json({ nonMutualGuilds, mutualGuilds });
};
