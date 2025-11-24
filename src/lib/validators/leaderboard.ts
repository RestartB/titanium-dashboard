import { z } from 'zod';

export const leaderboardLevelSchema = z.object({
  level: z.number().int().nonnegative().optional(),
  xp_required: z.number().int().nonnegative(),
  reward_roles: z.array(z.string()).default([])
});

export type LeaderboardLevelSchema = z.infer<typeof leaderboardLevelSchema>;

export const leaderboardConfigSchema = z.object({
  mode: z.enum(['fixed', 'random', 'length']).default('fixed'),
  cooldown: z.number().int().nonnegative(),
  xp: z.number().int().nonnegative().optional(),
  min_xp: z.number().int().nonnegative().optional(),
  max_xp: z.number().int().nonnegative().optional(),
  xp_mult: z.number().nonnegative().optional(),
  levelup_notifications: z.boolean().default(true),
  notification_channel: z.string().optional(),
  web_leaderboard_enabled: z.boolean().default(false),
  web_login_required: z.boolean().default(false),
  delete_leavers: z.boolean().default(false),
  levels: z.array(leaderboardLevelSchema).default([])
});

export type LeaderboardConfigSchema = z.infer<typeof leaderboardConfigSchema>;
