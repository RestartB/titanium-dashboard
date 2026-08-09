import { z } from 'zod';
import { validateID } from '$lib/helpers/discord';

export const confessionsConfigSchema = z
  .object({
    confessions_in_channel: z.boolean(),
    confessions_channel_id: z.string().nullable().optional(),
    polls_enabled: z.boolean(),
    attachments_allowed: z.boolean()
  })
  .refine(
    (data) => {
      return data.confessions_channel_id !== null && data.confessions_channel_id !== undefined
        ? validateID(data.confessions_channel_id)
        : true;
    },
    {
      message: 'Channel ID must be valid.',
      path: ['confessions_channel_id']
    }
  );

export type ConfessionsConfigSchema = z.infer<typeof confessionsConfigSchema>;
