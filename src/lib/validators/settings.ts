import { z } from 'zod';

export const moduleSchema = z.object({
  moderation: z.boolean(),
  automod: z.boolean(),
  bouncer: z.boolean(),
  logging: z.boolean(),
  fireboard: z.boolean(),
  server_counters: z.boolean(),
  confession: z.boolean()
});

export type ModuleSchema = z.infer<typeof moduleSchema>;

export const settingsSchema = z.object({
  loading_reaction: z.boolean()
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
});

export type GuildSettingsSchema = z.infer<typeof guildSettingsSchema>;
