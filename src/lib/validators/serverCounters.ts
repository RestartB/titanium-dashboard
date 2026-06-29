import { z } from 'zod';
import { validateID } from '$lib/helpers/discord';

export const serverCounterChannelSchema = z
  .object({
    id: z
      .string()
      .nullable()
      .optional()
      .transform((val) => (val === '' ? null : val)),
    name: z.string(),
    type: z.enum([
      'total_members',
      'users',
      'bots',
      'online_members',
      'offline_members',
      'channels',
      'categories',
      'roles',
      'total_xp'
    ])
  })
  .refine(
    (data) => {
      return data.id !== null && data.id !== undefined ? validateID(data.id) : true;
    },
    {
      message: 'Channel ID must be valid',
      path: ['id']
    }
  );

export type ServerCounterChannelSchema = z.infer<typeof serverCounterChannelSchema>;

export const serverCountersConfigSchema = z.object({
  channels: z.array(serverCounterChannelSchema).default([])
});

export type ServerCountersConfigSchema = z.infer<typeof serverCountersConfigSchema>;
