import { z } from 'zod';

export const repConfigSchema = z.object({
  rep_hint: z.boolean().default(true),
  allow_rep_remove: z.boolean().default(true),
  delete_leavers: z.boolean().default(false),

  web_leaderboard_enabled: z.boolean().default(true),
  web_login_required: z.boolean().default(true),

  ignored_roles: z.array(z.string()).max(100).default([]),
  ignored_channels: z.array(z.string()).max(100).default([])
});

export type RepConfigSchema = z.infer<typeof repConfigSchema>;
