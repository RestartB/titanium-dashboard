import { z } from 'zod';
import { validateID } from '$lib/helpers/discord';

export const automodCriterionSchema = z.object({
  type: z.enum([
    'word_list',
    'discord_dice_roll',
    'malicious_link',
    'phishing_link',
    'message_spam',
    'word_spam',
    'newline_spam',
    'link_spam',
    'attachment_spam',
    'emoji_spam'
  ]),

  threshold: z.number().int().nullable().optional(),
  duration: z.number().int().nullable().optional(),

  words: z.array(z.string().min(1).max(100)),
  match_whole_word: z.boolean(),
  match_all_words: z.boolean(),
  case_sensitive: z.boolean()
});

export type AutomodCriterionSchema = z.infer<typeof automodCriterionSchema>;

export const automodActionSchema = z
  .object({
    type: z.enum(['warn', 'mute', 'kick', 'ban', 'delete', 'add_role', 'remove_role', 'toggle_role', 'send_message']),

    duration: z.number().int().min(1).nullable().optional(),
    reason: z.string().trim().max(512).nullable().optional(),

    role_ids: z.array(z.string()),

    message_content: z.string().nullable().optional(),
    message_reply: z.boolean(),
    message_mention: z.boolean(),
    message_embed: z.boolean(),
    embed_colour: z.string().trim().nullable().optional()
  })
  .refine(
    (data) => {
      if (data.role_ids) {
        for (const role_id in data.role_ids) {
          if (!validateID(role_id)) {
            return false;
          }
        }
      }
      return true;
    },
    {
      message: 'Role IDs must be valid',
      path: ['role_ids']
    }
  );

export type AutomodActionSchema = z.infer<typeof automodActionSchema>;

export const automodRuleSchema = z
  .object({
    id: z.uuid(),
    rule_name: z.string().trim().max(100),

    enabled: z.boolean(),
    evaluate_edits: z.boolean(),
    match_all_criteria: z.boolean(),

    order: z.number().min(0).int(),
    stop_if_triggered: z.boolean(),

    criteria: z.array(automodCriterionSchema),
    actions: z.array(automodActionSchema)
  })
  .refine(
    (data) => {
      const criteriaTypes = data.criteria.map((criterion) => criterion.type);
      const uniqueCriteriaTypes = new Set(criteriaTypes);
      return criteriaTypes.length === uniqueCriteriaTypes.size;
    },
    {
      message: 'Each criterion type in a rule must be unique',
      path: ['criteria']
    }
  )
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
  rules: z.array(automodRuleSchema),
  show_outcome_message: z.boolean(),
  global_ignored_roles: z.array(z.string()).max(100).default([]),
  global_ignored_channels: z.array(z.string()).max(100).default([])
});

export type AutomodConfigSchema = z.infer<typeof automodConfigSchema>;
