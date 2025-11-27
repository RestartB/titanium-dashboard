import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
  const titaniumToken = cookies.get('titanium_token');
  if (!titaniumToken) {
    return { guildsData: null };
  }

  const guildsRequest = await fetch('/api/guilds');
  if (!guildsRequest.ok) {
    console.error('Failed to fetch guilds data:', await guildsRequest.text());
    return { guildsData: null };
  }

  const guildsData = await guildsRequest.json();

  return { guildsData };
};
