import { query, form, command, getRequestEvent } from '$app/server';
import { error, invalid } from '@sveltejs/kit';

import { z } from 'zod';
import { newTagSchema, editTagSchema, componentSchema } from '$lib/validators/tags';
import { remoteCheckToken } from '$lib/server/token';
import { apiLimit } from '$lib/server/limits';

import { TITANIUM_API_URL } from '$env/static/private';
import type { TagSessionData, TagsResponse } from '$lib/interfaces/tags';

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

async function tagDataReq(data: {
  userId?: string;
  tagId?: string;
  guildId?: string;
  pageKey?: string;
  submitKey?: string;
  name: string;
  cv2: boolean;
  content: string | undefined;
  components: z.infer<typeof componentSchema>[] | undefined;
}) {
  const { userId: user, tagId, guildId, pageKey, submitKey, ...tagData } = data;

  const tempLink = pageKey && submitKey;
  const method = tagId && !tempLink ? 'PATCH' : 'POST';
  const endpoint = tempLink
    ? `${TITANIUM_API_URL}/taglink/${pageKey}/submit`
    : `${TITANIUM_API_URL}/guild/${guildId}/tags${tagId ? '/' + tagId : ''}`;

  console.log(method, endpoint);

  return await fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Submit-Key': submitKey || ''
    },
    body: JSON.stringify({
      user,
      ...tagData
    })
  });
}

export const createTag = form(
  newTagSchema,
  async ({ guildId, pageKey, submitKey, name, cv2, content, components }, issue) => {
    if (!guildId && !(pageKey && submitKey)) {
      invalid(issue.guildId(`No guild ID or submission keys provided`));
    }

    const tokenRecord = guildId ? (await checkPerms(guildId)).tokenRecord : undefined;
    const postRequest = await tagDataReq({
      userId: tokenRecord?.discordUserId,
      guildId,
      pageKey,
      submitKey,
      name,
      cv2,
      content,
      components
    });
    if (!postRequest.ok) {
      console.error('Failed to create tag: ', postRequest.status, postRequest.statusText);
      console.error(await postRequest.text());
      return { success: false };
    }

    return { success: true };
  }
);

export const editTag = form(
  editTagSchema,
  async ({ guildId, pageKey, submitKey, tagId, cv2, name, content, components }, issue) => {
    if (!guildId && !(pageKey && submitKey)) {
      invalid(issue.guildId(`No guild ID or submission keys provided`));
    }

    const tokenRecord = guildId ? (await checkPerms(guildId)).tokenRecord : undefined;
    const postRequest = await tagDataReq({
      userId: tokenRecord?.discordUserId,
      guildId,
      pageKey,
      submitKey,
      tagId,
      name,
      cv2,
      content,
      components
    });
    if (!postRequest.ok) {
      console.error('Failed to edit tag: ', postRequest.status, postRequest.statusText);
      return { success: false };
    }

    return { success: true };
  }
);

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

// TODO: rate limiting for these endpoints
export const startEditSession = command(
  z.object({
    pageKey: z.uuidv4()
  }),
  async ({ pageKey }) => {
    const event = getRequestEvent();

    const request = await fetch(`${TITANIUM_API_URL}/taglink/${pageKey}/start`);
    if (!request.ok) {
      return error(request.status, request.statusText);
    }

    const data: TagSessionData = await request.json();
    event.cookies.set('submitKey', data.submit_key, {
      path: `/public/tagedit/${pageKey}`,
      sameSite: 'strict',
      expires: new Date(data.expires)
    });
    return data;
  }
);

export const continueEditSession = command(
  z.object({
    pageKey: z.uuidv4(),
    submitKey: z.uuidv4()
  }),
  async ({ pageKey, submitKey }) => {
    const request = await fetch(`${TITANIUM_API_URL}/taglink/${pageKey}/continue?submitKey=${submitKey}`);
    if (!request.ok) {
      console.log(request.status, request.statusText);
      return error(request.status, request.statusText);
    }

    const data: TagSessionData = await request.json();
    return data;
  }
);
