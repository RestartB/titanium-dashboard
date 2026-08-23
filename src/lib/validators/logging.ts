import { z } from 'zod';
import { validateID } from '$lib/helpers/discord';

export const loggingConfigSchema = z.object({
  channels: z.record(
    z.string(),
    z.string().refine((value) => validateID(value))
  ),
  ignored_creator_role_ids: z.array(z.string()).max(100).default([]),
  ignored_creator_user_ids: z.array(z.string()).max(100).default([]),
  ignored_target_role_ids: z.array(z.string()).max(100).default([]),
  ignored_target_user_ids: z.array(z.string()).max(100).default([])
});

export type LoggingConfigSchema = z.infer<typeof loggingConfigSchema>;
