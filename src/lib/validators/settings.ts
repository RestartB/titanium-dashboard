import { z } from 'zod';
import { validateID } from '$lib/helpers/discord';

export const moduleSchema = z.object({
  moderation: z.boolean(),
  automod: z.boolean(),
  bouncer: z.boolean(),
  logging: z.boolean(),
  fireboard: z.boolean(),
  server_counters: z.boolean(),
  confessions: z.boolean(),
  leaderboard: z.boolean(),
  tags: z.boolean()
});

export type ModuleSchema = z.infer<typeof moduleSchema>;

export const settingsSchema = z.object({
  loading_reaction: z.boolean(),
  delete_after_3_days: z.boolean()
});

export type SettingsSchema = z.infer<typeof settingsSchema>;

export const guildSettingsSchema = z.object({
  modules: moduleSchema,
  settings: settingsSchema,
  prefixes: z
    .array(z.string().min(1).max(5))
    .min(1, 'At least one prefix is required')
    .max(5, 'A maximum of 5 prefixes are allowed')
    .refine((prefixes) => prefixes.every((p) => p.length >= 1 && p.length <= 5), {
      message: 'Each prefix must be between 1 and 5 characters long'
    })
    .refine((prefixes) => new Set(prefixes).size === prefixes.length, {
      message: 'Prefixes must be unique'
    })
});

export type GuildSettingsSchema = z.infer<typeof guildSettingsSchema>;

export const guildPermissionsSchema = z
  .object({
    dashboard_managers: z.array(z.string()),
    case_managers: z.array(z.string())
  })
  .refine(
    (data) => {
      for (const userId of data.dashboard_managers) {
        if (!/^\d{15,20}$/.test(userId)) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Dashboard Manager IDs must be between 15 and 20 digits',
      path: ['dashboard_managers']
    }
  )
  .refine(
    (data) => {
      for (const userId of data.case_managers) {
        if (!validateID(userId)) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Case Manager IDs must be between 15 and 20 digits',
      path: ['case_managers']
    }
  );

export type GuildPermissionsSchema = z.infer<typeof guildPermissionsSchema>;
