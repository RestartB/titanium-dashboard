// Settings
export {
  moduleSchema,
  settingsSchema,
  guildSettingsSchema,
  guildPermissionsSchema,
  type ModuleSchema,
  type SettingsSchema,
  type GuildSettingsSchema,
  type GuildPermissionsSchema
} from './settings';

// Confessions
export { confessionsConfigSchema, type ConfessionsConfigSchema } from './confessions';

// Moderation
export { moderationConfigSchema, type ModerationConfigSchema } from './moderation';

// Automod
export {
  automodActionSchema,
  automodRuleSchema,
  automodConfigSchema,
  type AutomodActionSchema,
  type AutomodRuleSchema,
  type AutomodConfigSchema
} from './automod';

// Bouncer
export {
  bouncerCriterionSchema,
  bouncerActionSchema,
  bouncerRuleSchema,
  bouncerConfigSchema,
  type BouncerCriterionSchema,
  type BouncerActionSchema,
  type BouncerRuleSchema,
  type BouncerConfigSchema
} from './bouncer';

// Logging
export { loggingConfigSchema, type LoggingConfigSchema } from './logging';

// Fireboard
export {
  fireboardBoardSchema,
  fireboardConfigSchema,
  type FireboardBoardSchema,
  type FireboardConfigSchema
} from './fireboard';

// Server Counters
export {
  serverCounterChannelSchema,
  serverCountersConfigSchema,
  type ServerCounterChannelSchema,
  type ServerCountersConfigSchema
} from './serverCounters';

// Leaderboard
export {
  leaderboardLevelSchema,
  leaderboardConfigSchema,
  type LeaderboardLevelSchema,
  type LeaderboardConfigSchema
} from './leaderboard';

// Tags
export { tagsConfigSchema, newTagSchema, editTagSchema, type TagsConfigSchema } from './tags';
