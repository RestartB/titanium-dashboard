import { z } from 'zod';

export const moderationConfigSchema = z.object({
  dm_users: z.boolean(),
  external_cases: z.boolean(),
  ban_days: z.number().int().min(0).max(7),

  warn_additional: z.string().trim().max(256).nullable(),
  mute_additional: z.string().trim().max(256).nullable(),
  kick_additional: z.string().trim().max(256).nullable(),
  ban_additional: z.string().trim().max(256).nullable()
});

export type ModerationConfigSchema = z.infer<typeof moderationConfigSchema>;
