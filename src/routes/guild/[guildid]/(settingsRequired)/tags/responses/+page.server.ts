import { TITANIUM_API_URL } from '$env/static/private';
import { titaniumRequest } from '$lib/helpers/titanium';
import type { TagsId } from '$lib/interfaces/tags';
import type { PageServerLoad } from './$types';

type TagIdsResponse = {
  tags: TagsId[];
};

export const load: PageServerLoad = async ({ locals }) => {
  // Get data
  const response: TagIdsResponse = await titaniumRequest(TITANIUM_API_URL + '/guild/' + locals.guildId + '/tags/ids');
  return { ...response };
};
