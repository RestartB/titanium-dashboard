import { z } from 'zod';

export const automodActionSchema = z
  .object({
    type: z.enum(['warn', 'mute', 'kick', 'ban', 'delete', 'add_role', 'remove_role', 'toggle_role']),
    duration: z.number().int().positive().nullable().optional(),
    role_id: z.string().nullable().optional(),
    reason: z.string().nullable().optional()
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
  );

export type AutomodActionSchema = z.infer<typeof automodActionSchema>;

export const automodRuleSchema = z
  .object({
    id: z.uuid().nullable().optional(),
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
  malicious_link_detection: z.array(automodRuleSchema),
  phishing_link_detection: z.array(automodRuleSchema)
});

export type AutomodConfigSchema = z.infer<typeof automodConfigSchema>;
