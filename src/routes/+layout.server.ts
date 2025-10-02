import { TEST_MODE } from '$env/static/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
  const titaniumToken = cookies.get('titanium_token');
  if (!titaniumToken) {
    return { userData: null };
  }

  let userData = null;
  let guildsData = null;

  if (TEST_MODE === 'true') {
    userData = {
      userData: {
        id: '123456789012345678',
        username: 'TestUser',
        avatar: null
      }
    };
    return { userData, guildsData };
  }

  const userRequest = await fetch('/api/identify');
  if (!userRequest.ok) {
    console.error('Failed to fetch user data:', await userRequest.text());
    return { userData, guildsData };
  }
  userData = await userRequest.json();

  const guildsRequest = await fetch('/api/guilds');
  if (!guildsRequest.ok) {
    console.error('Failed to fetch guilds data:', await guildsRequest.text());
    return { userData, guildsData };
  }
  guildsData = await guildsRequest.json();

  return { userData, guildsData };
};
