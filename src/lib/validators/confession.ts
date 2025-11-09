import { z } from 'zod';

export const confessionConfigSchema = z.object({
  confession_channel_id: z.string().nullable().optional(),
  confession_log_channel_id: z.string().nullable().optional()
});

export type ConfessionConfigSchema = z.infer<typeof confessionConfigSchema>;
