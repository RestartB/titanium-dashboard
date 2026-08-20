import { TITANIUM_API_URL } from '$env/static/private';

import type { PageServerLoad } from './$types';
import type { LoggingEvent } from '$lib/interfaces/logging';
import type { LoggingConfigSchema } from '$lib/validators/logging';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Get data
  const request = await fetch('/api/guild/' + locals.guildId + '/module/logging');
  const pageSettings: LoggingConfigSchema = await request.json();

  const eventsInfoRequest = await fetch(`${TITANIUM_API_URL}/info/logging`);
  const loggingEvents: LoggingEvent[] = await eventsInfoRequest.json();

  return { pageSettings, loggingEvents };
};
