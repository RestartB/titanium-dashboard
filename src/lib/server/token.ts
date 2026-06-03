import { db } from '$lib/server/db';
import { token } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import { decrypt } from '$lib/server/crypto';
import { env } from '$env/dynamic/private';

import { error, type RequestEvent } from '@sveltejs/kit';
import type { InferSelectModel } from 'drizzle-orm';

async function checkToken(
  event: RequestEvent
): Promise<{ token: InferSelectModel<typeof token> | undefined; expired: boolean }> {
  // token present check
  const titaniumToken = event.cookies.get('titanium_token');
  if (!titaniumToken) {
    return { token: undefined, expired: false };
  }

  // token valid check
  const tokenRecord = await db.select().from(token).where(eq(token.token, titaniumToken)).get();
  if (!tokenRecord) {
    return { token: undefined, expired: false };
  }

  // decrypt token
  tokenRecord.discordToken = decrypt(
    tokenRecord.discordToken,
    Buffer.from(tokenRecord.discordTokenIV, 'hex'),
    Buffer.from(tokenRecord.discordTokenAuthTag, 'hex')
  );

  return {
    token: tokenRecord,
    expired:
      tokenRecord.tokenExpiresAt <= new Date() ||
      tokenRecord.createdAt.getTime() + tokenRecord.discordExpiresIn * 1000 <= Date.now()
  };
}

async function deleteToken(tokenId: string, discordToken: string | undefined) {
  // delete titanium token
  await db.delete(token).where(eq(token.token, tokenId)).run();
  console.debug('Revoked Titanium token');

  if (!discordToken) {
    return;
  }

  // revoke discord token if present
  const newRequest = await fetch('https://discord.com/api/v10/oauth2/token/revoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      token: discordToken,
      token_type_hint: 'access_token'
    })
  });

  if (!newRequest.ok) {
    console.error(newRequest.status, 'Failed to revoke token');
  }

  console.debug('Revoked Discord token');
}

/**
 * Utility function for remote functions to check if user's token is expired, and delete the token & raise an error if it is
 * @param event Request event to check
 */
async function remoteCheckToken(event: RequestEvent): Promise<InferSelectModel<typeof token>> {
  const { token: titaniumToken, expired } = await checkToken(event);

  if (!titaniumToken || expired) {
    if (titaniumToken && expired) {
      await deleteToken(titaniumToken.token, titaniumToken.discordToken);
    }

    throw error(401, 'Unauthorized');
  }

  return titaniumToken;
}

export { checkToken, deleteToken, remoteCheckToken };
