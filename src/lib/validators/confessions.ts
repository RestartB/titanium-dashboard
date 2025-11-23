import { z } from 'zod';

export const confessionsConfigSchema = z.object({
  confessions_in_channel: z.boolean(),
  confessions_channel_id: z.string().nullable().optional()
});

export type ConfessionsConfigSchema = z.infer<typeof confessionsConfigSchema>;
