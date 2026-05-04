import { z } from 'zod';
import { validateID } from '$lib/helpers/discord';

export const loggingConfigSchema = z.object({
  channels: z.record(
    z.string(),
    z.string().refine((value) => validateID(value))
  )
});

export type LoggingConfigSchema = z.infer<typeof loggingConfigSchema>;
