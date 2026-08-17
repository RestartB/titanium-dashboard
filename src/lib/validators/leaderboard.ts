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
      message: 'Role IDs must be valid.',
      path: ['reward_roles']
    }
  );

export type LeaderboardLevelSchema = z.infer<typeof leaderboardLevelSchema>;

export const leaderboardConfigSchema = z
  .object({
    mode: z.enum(['fixed', 'random', 'length']).default('fixed'),
    cooldown: z.number().int().nonnegative(),
    base_xp: z.number().int().nonnegative().default(10),
    min_xp: z.number().int().nonnegative().default(15),
    max_xp: z.number().int().nonnegative().default(25),
    xp_mult: z.number().nonnegative().default(1.0),
    vc_enabled: z.boolean().default(false),
    vc_mode: z.enum(['fixed', 'random']).default('fixed'),
    vc_delay: z.number().int().nonnegative().max(1440),
    vc_base_xp: z.number().int().nonnegative().default(10),
    vc_min_xp: z.number().int().nonnegative().default(15),
    vc_max_xp: z.number().int().nonnegative().default(25),
    ignored_roles: z.array(z.string()).max(100).default([]),
    ignored_channels: z.array(z.string()).max(100).default([]),
    bot_message_tracking: z.boolean().default(true),
    bot_message_xp: z.boolean().default(false),
    bot_vc_tracking: z.boolean().default(true),
    bot_vc_xp: z.boolean().default(false),
    levelup_notifications: z.boolean().default(true),
    notification_ping: z.boolean().default(true),
    notification_channel: z.string().optional().nullable(),
    web_leaderboard_enabled: z.boolean().default(true),
    web_login_required: z.boolean().default(true),
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
      message: 'Channel ID must be valid.',
      path: ['notification_channel']
    }
  );

export type LeaderboardConfigSchema = z.infer<typeof leaderboardConfigSchema>;
