import { z } from 'zod';
import { validateID } from '$lib/helpers/discord';

export const fireboardBoardSchema = z
  .object({
    id: z.uuid().nullable().optional(),

    channel_id: z.string(),
    reaction: z.string(),
    threshold: z.number().int().positive(),

    ignore_bots: z.boolean(),
    ignore_self_reactions: z.boolean(),
    send_notifications: z.boolean(),

    ignored_roles: z.array(z.string()).default([]),
    ignored_channels: z.array(z.string()).default([])
  })
  .refine(
    (data) => {
      return validateID(data.channel_id);
    },
    {
      message: 'Channel ID must be valid.',
      path: ['channel_id']
    }
  );

export type FireboardBoardSchema = z.infer<typeof fireboardBoardSchema>;

export const fireboardConfigSchema = z.object({
  global_ignored_roles: z.array(z.string()).max(100).default([]),
  global_ignored_channels: z.array(z.string()).max(100).default([]),
  boards: z.array(fireboardBoardSchema).default([])
});

export type FireboardConfigSchema = z.infer<typeof fireboardConfigSchema>;
