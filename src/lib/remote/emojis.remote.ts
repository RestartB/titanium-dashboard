import { error } from '@sveltejs/kit';
import { query, getRequestEvent } from '$app/server';

import { remoteCheckToken } from '$lib/server/token';
import { apiLimit } from '$lib/server/limits';

import emojis from 'emojibase-data/en/data.json';
import groupsSubgroups from 'emojibase-data/en/messages.json';
import shortcodes from 'emojibase-data/en/shortcodes/joypixels.json';

export const getEmojiData = query(async () => {
  const event = getRequestEvent();

  await remoteCheckToken(event);
  if (await apiLimit.isLimited(event)) throw error(429);

  return { emojis, groupsSubgroups, shortcodes };
});
