import { db } from '$lib/server/db';
import { token } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import { decrypt } from '$lib/server/crypto';

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

  // decrypt token
  tokenRecord.discordToken = decrypt(
    tokenRecord.discordToken,
    Buffer.from(tokenRecord.discordTokenIV, 'hex'),
    Buffer.from(tokenRecord.discordTokenAuthTag, 'hex')
  );

  return tokenRecord;
}

export { checkToken };
