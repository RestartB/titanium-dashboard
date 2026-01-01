import { db } from '$lib/server/db';
import { token } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import type { RequestEvent } from '@sveltejs/kit';
import type { InferSelectModel } from 'drizzle-orm';

async function checkToken(event: RequestEvent): Promise<InferSelectModel<typeof token> | undefined> {
  // token present check
  const titaniumToken = event.cookies.get('titanium_token');
  if (!titaniumToken) {
    return;
  }

  // token valid check
  const tokenRecord = await db.select().from(token).where(eq(token.token, titaniumToken)).get();
  if (!tokenRecord) {
    return;
  }

  return tokenRecord;
}

export { checkToken };
