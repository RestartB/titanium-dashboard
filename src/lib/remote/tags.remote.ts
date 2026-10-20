import { query, form, command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

import { z } from 'zod';
import { newTagSchema, editTagSchema } from '$lib/validators/tags';
import { remoteCheckToken } from '$lib/server/token';
import { apiLimit } from '$lib/server/limits';

import { TITANIUM_API_URL } from '$env/static/private';
import type { TagsResponse } from '$lib/interfaces/tags';

async function checkPerms(guildId: string) {
  const event = getRequestEvent();

  const tokenRecord = await remoteCheckToken(event);
  if (await apiLimit.isLimited(event)) throw error(429);

  const permCheckRequest = await fetch(`${TITANIUM_API_URL}/guild/` + guildId + '/perms/' + tokenRecord.discordUserId);

  if (!permCheckRequest.ok) {
    if (permCheckRequest.status === 404) throw error(404, 'Guild not found');
    throw error(500, 'Unknown error');
  }

  const permCheck = await permCheckRequest.json();
  if (!permCheck.dashboard_manager) throw error(401, 'Unauthorized');

  return { event, tokenRecord };
}

export const getTags = query(
  z.object({
    guildId: z.string(),
    limit: z.int().max(100).nonnegative(),
    offset: z.int().nonnegative()
  }),
  async ({ guildId, limit, offset }) => {
    await checkPerms(guildId);
    const request = await fetch(`${TITANIUM_API_URL}/guild/${guildId}/tags?limit=${limit}&offset=${offset}`);

    if (!request.ok) {
      console.error('Failed to fetch comments:', await request.text());
      throw error(500, 'Unknown error');
    }

    const data = await request.json();
    return data as TagsResponse;
  }
);

export const createTag = form(newTagSchema, async ({ guildId, name, cv2, content, components }) => {
  const { tokenRecord } = await checkPerms(guildId);

  const postRequest = await fetch(`${TITANIUM_API_URL}/guild/${guildId}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: tokenRecord.discordUserId,
      name: name,
      cv2: cv2,
      content: content,
      components: components
    })
  });

  if (!postRequest.ok) {
    console.error('Failed to create tag: ', postRequest.status, postRequest.statusText);
    return { success: false };
  }

  return { success: true };
});

export const editTag = form(editTagSchema, async ({ guildId, tagId, cv2, name, content, components }) => {
  const { tokenRecord } = await checkPerms(guildId);

  const postRequest = await fetch(`${TITANIUM_API_URL}/guild/${guildId}/tags/${tagId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: tokenRecord.discordUserId,
      cv2: cv2,
      name: name,
      content: content,
      components: components
    })
  });

  if (!postRequest.ok) {
    console.error('Failed to edit tag: ', postRequest.status, postRequest.statusText);
    return { success: false };
  }

  return { success: true };
});

export const deleteTag = command(
  z.object({
    guildId: z.string(),
    tagId: z.uuidv4()
  }),
  async ({ guildId, tagId }) => {
    await checkPerms(guildId);

    const postRequest = await fetch(`${TITANIUM_API_URL}/guild/${guildId}/tags/${tagId}`, { method: 'DELETE' });
    if (!postRequest.ok) {
      console.error('Failed to delete tag: ', postRequest.status, postRequest.statusText);
      return { success: false };
    }

    return { success: true };
  }
);
