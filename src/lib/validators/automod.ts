import { z } from 'zod';
import { validateID } from '$lib/helpers/discord';

export const automodActionSchema = z
  .object({
    type: z.enum(['warn', 'mute', 'kick', 'ban', 'delete', 'add_role', 'remove_role', 'toggle_role', 'send_message']),
    reason: z.string().nullable().optional(),
    duration: z.number().int().nullable().optional(),

    role_id: z.string().nullable().optional(),

    message_content: z.string().nullable().optional(),
    message_reply: z.boolean().nullable().optional(),
    message_mention: z.boolean().nullable().optional(),
    message_embed: z.boolean().nullable().optional(),
    embed_colour: z.string().nullable().optional()
  })
  .refine(
    (data) => {
      if (data.type === 'mute') {
        return data.duration !== null && data.duration !== undefined && data.duration > 0;
      }
      return true;
    },
    {
      message: 'Mute actions must have a positive duration',
      path: ['duration']
    }
  )
  .refine(
    (data) => {
      if (['add_role', 'remove_role', 'toggle_role'].includes(data.type)) {
        return data.role_id !== null && data.role_id !== undefined && validateID(data.role_id);
      }
      return true;
    },
    {
      message: 'Role ID must be between 15 and 20 digits',
      path: ['role_id']
    }
  );

export type AutomodActionSchema = z.infer<typeof automodActionSchema>;

export const automodRuleSchema = z
  .object({
    id: z.string().nullable().optional(),
    rule_type: z.enum(['badword_detection', 'spam_detection', 'malicious_link', 'phishing_link']),
    rule_name: z.string().default(''),
    words: z.array(z.string()).default([]),
    match_whole_word: z.boolean().default(false),
    case_sensitive: z.boolean().default(false),
    antispam_type: z
      .enum(['message', 'mention', 'word', 'newline', 'link', 'attachment', 'emoji'])
      .nullable()
      .optional(),
    threshold: z.number().int(),
    duration: z.number().int(),
    actions: z.array(automodActionSchema)
  })
  .refine(
    (data) => {
      const actionTypes = data.actions.map((action) => action.type);
      const uniqueActionTypes = new Set(actionTypes);
      return actionTypes.length === uniqueActionTypes.size;
    },
    {
      message: 'Each action type in a rule must be unique',
      path: ['actions']
    }
  );

export type AutomodRuleSchema = z.infer<typeof automodRuleSchema>;

export const automodConfigSchema = z.object({
  badword_detection: z.array(automodRuleSchema),
  spam_detection: z.array(automodRuleSchema),
  malicious_link: z.array(automodRuleSchema),
  phishing_link: z.array(automodRuleSchema)
});

export type AutomodConfigSchema = z.infer<typeof automodConfigSchema>;
