import type { LayoutServerLoad } from './$types';
import type { UserInfo } from '$lib/interfaces/userInfo';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
  let userData: UserInfo | null = null;

  const titaniumToken = cookies.get('titanium_token');
  if (!titaniumToken) {
    return { userData };
  }

  const userRequest = await fetch('/api/identify');

  if (userRequest.status === 401) {
    return { userData };
  }

  if (!userRequest.ok) {
    console.error('Failed to fetch user data:', await userRequest.text());
    return { userData };
  }
  userData = await userRequest.json();

  return { userData };
};
