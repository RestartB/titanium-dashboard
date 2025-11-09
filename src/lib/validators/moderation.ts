import { z } from 'zod';

export const moderationConfigSchema = z.object({
  delete_confirmation: z.boolean(),
  dm_users: z.boolean(),
  external_cases: z.boolean(),
  external_case_dms: z.boolean()
});

export type ModerationConfigSchema = z.infer<typeof moderationConfigSchema>;
