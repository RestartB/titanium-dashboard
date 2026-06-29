import { z } from 'zod';
import { validateID } from '$lib/helpers/discord';

export const bouncerCriterionSchema = z.object({
  type: z.enum(['username', 'tag', 'age', 'avatar']),
  account_age: z.number().int().positive().nullable().optional(),
  words: z.array(z.string()).nullable().optional(),
  match_whole_word: z.boolean().optional(),
  case_sensitive: z.boolean().optional()
});

export type BouncerCriterionSchema = z.infer<typeof bouncerCriterionSchema>;

export const bouncerActionSchema = z
  .object({
    type: z.enum(['warn', 'mute', 'kick', 'ban', 'reset_nick', 'add_role', 'remove_role', 'toggle_role']),
    duration: z.number().int().positive().nullable().optional(),
    role_id: z.string().nullable().optional(),
    reason: z.string().nullable().optional()
  })
  .refine(
    (data) => {
      if (['add_role', 'remove_role', 'toggle_role'].includes(data.type)) {
        return data.role_id !== null && data.role_id !== undefined && validateID(data.role_id);
      }
      return true;
    },
    {
      message: 'Role ID must be valid',
      path: ['role_id']
    }
  );

export type BouncerActionSchema = z.infer<typeof bouncerActionSchema>;

export const bouncerRuleSchema = z
  .object({
    id: z.string(),
    enabled: z.boolean(),
    evaluate_for_existing_members: z.boolean(),
    criteria: z.array(bouncerCriterionSchema),
    actions: z.array(bouncerActionSchema)
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

export type BouncerRuleSchema = z.infer<typeof bouncerRuleSchema>;

export const bouncerConfigSchema = z.object({
  rules: z.array(bouncerRuleSchema)
});

export type BouncerConfigSchema = z.infer<typeof bouncerConfigSchema>;
