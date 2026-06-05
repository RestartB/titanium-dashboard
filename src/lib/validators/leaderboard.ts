import { z } from 'zod';
import { validateID } from '$lib/helpers/discord';

export const leaderboardLevelSchema = z
  .object({
    id: z.string().default('').optional(),
    xp_required: z.number().int().nonnegative(),
    reward_roles: z.array(z.string()).max(5).default([])
  })
  .refine(
    (data) => {
      for (const roleId of data.reward_roles) {
        if (!validateID(roleId)) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Role IDs must be between 15 and 20 digits',
      path: ['reward_roles']
    }
  );

export type LeaderboardLevelSchema = z.infer<typeof leaderboardLevelSchema>;

export const leaderboardConfigSchema = z
  .object({
    mode: z.enum(['fixed', 'random', 'length']).default('fixed'),
    cooldown: z.number().int().nonnegative(),
    base_xp: z.number().int().nonnegative().optional(),
    min_xp: z.number().int().nonnegative().optional(),
    max_xp: z.number().int().nonnegative().optional(),
    xp_mult: z.number().nonnegative().optional(),
    ignored_roles: z.array(z.string()).max(100).default([]),
    ignored_channels: z.array(z.string()).max(100).default([]),
    levelup_notifications: z.boolean().default(true),
    notification_ping: z.boolean().default(true),
    notification_channel: z.string().optional().nullable(),
    web_leaderboard_enabled: z.boolean().default(false),
    web_login_required: z.boolean().default(false),
    delete_leavers: z.boolean().default(false),
    stack_roles: z.boolean().default(true),
    levels: z.array(leaderboardLevelSchema).default([])
  })
  .refine(
    (data) => {
      return data.notification_channel !== null && data.notification_channel !== undefined
        ? validateID(data.notification_channel)
        : true;
    },
    {
      message: 'Channel ID must be between 15 and 20 digits',
      path: ['notification_channel']
    }
  );

export type LeaderboardConfigSchema = z.infer<typeof leaderboardConfigSchema>;
