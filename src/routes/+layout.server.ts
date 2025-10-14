import { TEST_MODE } from '$env/static/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
  const titaniumToken = cookies.get('titanium_token');
  if (!titaniumToken) {
    return { userData: null };
  }

  let userData = null;

  if (TEST_MODE === 'true') {
    userData = {
      userData: {
        id: '123456789012345678',
        username: 'TestUser',
        avatar: null
      }
    };
    return { userData };
  }

  const userRequest = await fetch('/api/identify');
  if (!userRequest.ok) {
    console.error('Failed to fetch user data:', await userRequest.text());
    return { userData };
  }
  userData = await userRequest.json();

  console.log('User data fetched:', userData);

  return { userData };
};
