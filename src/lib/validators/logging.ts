import { z } from 'zod';

export const loggingConfigSchema = z.object({
  // App command events
  app_command_perm_update_id: z.string().nullable().optional(),

  // Discord automod events
  dc_automod_rule_create_id: z.string().nullable().optional(),
  dc_automod_rule_update_id: z.string().nullable().optional(),
  dc_automod_rule_delete_id: z.string().nullable().optional(),

  // Channel events
  channel_create_id: z.string().nullable().optional(),
  channel_update_id: z.string().nullable().optional(),
  channel_delete_id: z.string().nullable().optional(),

  // Guild events
  guild_name_update_id: z.string().nullable().optional(),
  guild_afk_channel_update_id: z.string().nullable().optional(),
  guild_afk_timeout_update_id: z.string().nullable().optional(),
  guild_icon_update_id: z.string().nullable().optional(),
  guild_emoji_create_id: z.string().nullable().optional(),
  guild_emoji_delete_id: z.string().nullable().optional(),
  guild_sticker_create_id: z.string().nullable().optional(),
  guild_sticker_delete_id: z.string().nullable().optional(),
  guild_invite_create_id: z.string().nullable().optional(),
  guild_invite_delete_id: z.string().nullable().optional(),

  // Member events
  member_join_id: z.string().nullable().optional(),
  member_leave_id: z.string().nullable().optional(),
  member_nickname_update_id: z.string().nullable().optional(),
  member_roles_update_id: z.string().nullable().optional(),
  member_ban_id: z.string().nullable().optional(),
  member_unban_id: z.string().nullable().optional(),
  member_kick_id: z.string().nullable().optional(),
  member_timeout_id: z.string().nullable().optional(),
  member_untimeout_id: z.string().nullable().optional(),

  // Message events
  message_edit_id: z.string().nullable().optional(),
  message_delete_id: z.string().nullable().optional(),
  message_bulk_delete_id: z.string().nullable().optional(),

  // Poll events
  poll_create_id: z.string().nullable().optional(),
  poll_delete_id: z.string().nullable().optional(),

  // Reaction events
  reaction_clear_id: z.string().nullable().optional(),
  reaction_clear_emoji_id: z.string().nullable().optional(),

  // Role events
  role_create_id: z.string().nullable().optional(),
  role_update_id: z.string().nullable().optional(),
  role_delete_id: z.string().nullable().optional(),

  // Scheduled event events
  scheduled_event_create_id: z.string().nullable().optional(),
  scheduled_event_update_id: z.string().nullable().optional(),
  scheduled_event_delete_id: z.string().nullable().optional(),

  // Soundboard events
  soundboard_sound_create_id: z.string().nullable().optional(),
  soundboard_sound_update_id: z.string().nullable().optional(),
  soundboard_sound_delete_id: z.string().nullable().optional(),

  // Stage instance events
  stage_instance_create_id: z.string().nullable().optional(),
  stage_instance_update_id: z.string().nullable().optional(),
  stage_instance_delete_id: z.string().nullable().optional(),

  // Thread events
  thread_create_id: z.string().nullable().optional(),
  thread_update_id: z.string().nullable().optional(),
  thread_remove_id: z.string().nullable().optional(),
  thread_delete_id: z.string().nullable().optional(),

  // Voice events
  voice_join_id: z.string().nullable().optional(),
  voice_leave_id: z.string().nullable().optional(),
  voice_move_id: z.string().nullable().optional(),
  voice_mute_id: z.string().nullable().optional(),
  voice_unmute_id: z.string().nullable().optional(),
  voice_deafen_id: z.string().nullable().optional(),
  voice_undeafen_id: z.string().nullable().optional(),

  // Titanium moderation events
  titanium_warn_id: z.string().nullable().optional(),
  titanium_mute_id: z.string().nullable().optional(),
  titanium_unmute_id: z.string().nullable().optional(),
  titanium_kick_id: z.string().nullable().optional(),
  titanium_ban_id: z.string().nullable().optional(),
  titanium_unban_id: z.string().nullable().optional(),
  titanium_case_delete_id: z.string().nullable().optional(),
  titanium_case_comment_id: z.string().nullable().optional(),
  titanium_automod_trigger_id: z.string().nullable().optional()
});

export type LoggingConfigSchema = z.infer<typeof loggingConfigSchema>;
