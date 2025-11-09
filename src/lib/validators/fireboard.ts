import { z } from 'zod';

export const fireboardBoardSchema = z.object({
  id: z
    .uuid()
    .nullable()
    .optional()
    .transform((val) => (val === '' ? null : val)),
  channel_id: z.string(),
  reaction: z.string(),
  threshold: z.number().int().positive(),
  ignore_bots: z.boolean(),
  ignore_self_reactions: z.boolean(),
  ignored_roles: z.array(z.string()).default([]),
  ignored_channels: z.array(z.string()).default([])
});

export type FireboardBoardSchema = z.infer<typeof fireboardBoardSchema>;

export const fireboardConfigSchema = z.object({
  global_ignored_roles: z.array(z.string()).default([]),
  global_ignored_channels: z.array(z.string()).default([]),
  boards: z.array(fireboardBoardSchema).default([])
});

export type FireboardConfigSchema = z.infer<typeof fireboardConfigSchema>;
