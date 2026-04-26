import { query, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

import { createHash } from 'node:crypto';

import { z } from 'zod';
import { remoteCheckToken } from '$lib/server/token';
import { apiLimit } from '$lib/limits';

import { KLIPY_KEY } from '$env/static/private';
import type { GifResults, GifCategoriesResult } from '$lib/interfaces/gif';

export const getGifCategories = query(z.object({ region: z.string() }), async ({ region }) => {
  const event = getRequestEvent();

  await remoteCheckToken(event);
  if (await apiLimit.isLimited(event)) throw error(429);

  const request = await fetch(`https://api.klipy.com/api/v1/${KLIPY_KEY}/gifs/categories?locale=${region}`);

  if (!request.ok) {
    console.error('Failed to fetch categories:', await request.text());
    throw error(500, 'Unknown error');
  }

  const data = await request.json();
  return data as GifCategoriesResult;
});

export const getTrendingGifs = query(
  z.object({ page: z.int().nonnegative(), region: z.string() }),
  async ({ page, region }) => {
    const event = getRequestEvent();

    const tokenRecord = await remoteCheckToken(event);
    if (await apiLimit.isLimited(event)) throw error(429);

    // hash user id + klipy key to send as customer id
    const customerId = createHash('sha256').update(`${tokenRecord.discordUserId}-${KLIPY_KEY}`).digest('hex');
    const request = await fetch(
      `https://api.klipy.com/api/v1/${KLIPY_KEY}/gifs/trending?page=${page}&customer_id=${customerId}&locale=${region}&format_filter=webp`
    );

    if (!request.ok) {
      console.error('Failed to fetch trending GIFs:', await request.text());
      throw error(500, 'Unknown error');
    }

    const data = await request.json();
    return data as GifResults;
  }
);

export const searchGifs = query(
  z.object({ query: z.string(), page: z.int().nonnegative(), region: z.string() }),
  async ({ query, page, region }) => {
    const event = getRequestEvent();

    const tokenRecord = await remoteCheckToken(event);
    if (await apiLimit.isLimited(event)) throw error(429);

    // hash user id + klipy key to send as customer id
    const customerId = createHash('sha256').update(`${tokenRecord.discordUserId}-${KLIPY_KEY}`).digest('hex');
    const request = await fetch(
      `https://api.klipy.com/api/v1/${KLIPY_KEY}/gifs/search?page=${page}&customer_id=${customerId}&locale=${region}&format_filter=webp&q=${encodeURIComponent(query)}`
    );

    if (!request.ok) {
      console.error('Failed to fetch GIF search:', await request.text());
      throw error(500, 'Unknown error');
    }

    const data = await request.json();
    return data as GifResults;
  }
);
