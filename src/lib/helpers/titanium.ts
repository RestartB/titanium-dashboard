import { error } from '@sveltejs/kit';

export async function titaniumRequest(path: string) {
  try {
    const modulesRequest = await fetch(path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!modulesRequest.ok) {
      console.error(modulesRequest.statusText);
      error(modulesRequest.status, 'Failed to fetch data from Titanium');
    }

    return await modulesRequest.json();
  } catch (err) {
    if (err instanceof TypeError) {
      console.error('Network error:', err.message);
      throw error(503, 'Titanium is unavailable. Please try again later.');
    }

    throw err;
  }
}
