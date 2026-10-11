import { z } from 'zod';

export const moderationConfigSchema = z.object({
  dm_users: z.boolean(),
  external_cases: z.boolean(),
  ban_days: z.number().int().min(0).max(7)
});

export type ModerationConfigSchema = z.infer<typeof moderationConfigSchema>;
