import { redirect } from '@sveltejs/kit';
import { checkToken, deleteToken } from '$lib/server/token';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  const { token } = await checkToken(event);
  if (!token) {
    console.log('No token found');
    return redirect(302, '/');
  }

  await deleteToken(token.token, token.discordToken);

  event.cookies.delete('titanium_token', { path: '/' });
  event.cookies.delete('titanium_state', { path: '/' });
  console.log('Deleted cookies');

  // check for reenter query param
  const reenter = event.url.searchParams.get('reenter');

  if (reenter) {
    return redirect(302, '/auth/login?redirect=' + encodeURIComponent(reenter));
  }

  return redirect(302, '/');
};
