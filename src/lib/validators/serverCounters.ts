import { z } from 'zod';

export const serverCounterChannelSchema = z.object({
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
    'members_status_online',
    'members_status_idle',
    'members_status_dnd',
    'members_activity',
    'members_custom_status',
    'offline_members',
    'channels',
    'activity'
  ]),
  activity_name: z.string().nullable().optional()
});

export type ServerCounterChannelSchema = z.infer<typeof serverCounterChannelSchema>;

export const serverCountersConfigSchema = z.object({
  channels: z.array(serverCounterChannelSchema).default([])
});

export type ServerCountersConfigSchema = z.infer<typeof serverCountersConfigSchema>;
