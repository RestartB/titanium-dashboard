import { form, query, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

import { z } from 'zod';
import { remoteCheckToken } from '$lib/server/token';
import { commentsLimit, apiLimit } from '$lib/limits';

import { TITANIUM_API_URL } from '$env/static/private';
import type { RateLimiter } from 'sveltekit-rate-limiter/server';

async function checkPerms(guildId: string, limit: RateLimiter = apiLimit) {
  const event = getRequestEvent();

  const tokenRecord = await remoteCheckToken(event);
  if (await limit.isLimited(event)) throw error(429);

  const permCheckRequest = await fetch(`${TITANIUM_API_URL}/guild/` + guildId + '/perms/' + tokenRecord.discordUserId);

  if (!permCheckRequest.ok) {
    if (permCheckRequest.status === 404) throw error(404, 'Guild not found');
    throw error(500, 'Unknown error');
  }

  const permCheck = await permCheckRequest.json();
  if (!permCheck.case_manager) throw error(401, 'Unauthorized');

  return { event, tokenRecord };
}

export const getComments = query(z.object({ guildId: z.string(), caseId: z.string() }), async ({ guildId, caseId }) => {
  await checkPerms(guildId);
  const request = await fetch(`${TITANIUM_API_URL}/guild/${guildId}/cases/${caseId}/comments`);

  if (!request.ok) {
    console.error('Failed to fetch comments:', await request.text());
    throw error(500, 'Unknown error');
  }

  const data = await request.json();
  return data;
});

export const createComment = form(
  z.object({
    guildId: z.string(),
    caseId: z.string(),
    content: z
      .string('Please enter a comment.')
      .trim()
      .min(1)
      .max(500, 'Please ensure your comment is under 500 characters.')
  }),
  async ({ guildId, caseId, content }) => {
    const { tokenRecord } = await checkPerms(guildId, commentsLimit);

    const postRequest = await fetch(`${TITANIUM_API_URL}/guild/${guildId}/cases/${caseId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: tokenRecord.discordUserId, content: content })
    });

    if (!postRequest.ok) {
      console.error('Failed to create comment', postRequest.status, postRequest.statusText);
      return { success: false };
    }

    return { success: true };
  }
);

export const deleteComment = command(
  z.object({
    guildId: z.string(),
    caseId: z.string(),
    commentId: z.string()
  }),
  async ({ guildId, caseId, commentId }) => {
    const { tokenRecord } = await checkPerms(guildId);

    const deleteRequest = await fetch(`${TITANIUM_API_URL}/guild/${guildId}/cases/${caseId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: tokenRecord.discordUserId })
    });

    if (!deleteRequest.ok) {
      return { success: false };
    }

    return { success: true };
  }
);
