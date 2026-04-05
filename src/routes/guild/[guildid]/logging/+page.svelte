<script lang="ts">
  import { page } from '$app/state';

  import ChannelButton from '$lib/components/ui/discord/ChannelButton.svelte';
  import Collapsible from '$lib/components/ui/Collapsible.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';

  import { ListPlus, ListX, X } from '@lucide/svelte';

  import type { LoggingConfigSchema } from '$lib/validators/logging';

  let { data } = $props();
  let dataState = $state(data);

  let overlayOpen = $state(false);
  let selectAllChannel: string | undefined = $state();

  const logTypeStrings: Record<string, string[]> = {
    app_command_perm_update_id: [
      'App Command Permissions Update',
      "When an application command's permissions are edited."
    ],
    dc_automod_rule_create_id: ['Discord AutoMod Rule Created', 'When a new Discord AutoMod rule is created.'],
    dc_automod_rule_update_id: ['Discord AutoMod Rule Updated', 'When a Discord AutoMod rule is edited.'],
    dc_automod_rule_delete_id: ['Discord AutoMod Rule Deleted', 'When a Discord AutoMod rule is deleted.'],
    channel_create_id: ['Channel Created', 'When a new channel is created.'],
    channel_update_id: ['Channel Updated', 'When a channel is edited.'],
    channel_delete_id: ['Channel Deleted', 'When a channel is deleted.'],
    guild_name_update_id: ['Guild Name Updated', "When the server's name is changed."],
    guild_afk_channel_update_id: ['Guild AFK Channel Updated', "When the server's AFK channel is changed."],
    guild_afk_timeout_update_id: ['Guild AFK Timeout Updated', "When the server's AFK timeout is changed."],
    guild_icon_update_id: ['Guild Icon Updated', "When the guild's icon is changed."],
    guild_features_update_id: ['Guild Features Updated', "When the guild's features are updated."],
    guild_emoji_create_id: ['Guild Emoji Created', 'When a new guild emoji is created.'],
    guild_emoji_delete_id: ['Guild Emoji Deleted', 'When a guild emoji is deleted.'],
    guild_sticker_create_id: ['Guild Sticker Created', 'When a new guild sticker is created.'],
    guild_sticker_delete_id: ['Guild Sticker Deleted', 'When a guild sticker is deleted.'],
    guild_invite_create_id: ['Guild Invite Created', 'When a server invite is created.'],
    guild_invite_delete_id: ['Guild Invite Deleted', 'When a server invite is deleted.'],
    member_join_id: ['Member Joined', 'When a new member joins the server.'],
    member_leave_id: ['Member Left', 'When a member leaves the server.'],
    member_nickname_update_id: ['Member Nickname Updated', 'When a user changes their server nickname.'],
    member_roles_update_id: ['Member Roles Updated', "When a user's assigned roles changes."],
    member_ban_id: ['Member Banned', 'When a user is banned from the server.'],
    member_unban_id: ['Member Unbanned', 'When a user is unbanned from the server.'],
    member_kick_id: ['Member Kicked', 'When a user is kicked from the server.'],
    member_timeout_id: ['Member Timed Out', 'When a user is timed out.'],
    member_untimeout_id: ['Member Timeout Removed', "When a user's timeout is removed."],
    message_edit_id: ['Message Edited', 'When a message is edited.'],
    message_delete_id: ['Message Deleted', 'When a message is deleted.'],
    message_bulk_delete_id: [
      'Message Bulk Deleted',
      'When multiple messages are deleted, normally by the purge feature.'
    ],
    poll_create_id: ['Poll Created', 'When a new poll is created.'],
    poll_delete_id: ['Poll Deleted', 'When a poll is deleted.'],
    reaction_clear_id: ['Reactions Cleared', 'When all reactions on a message are cleared.'],
    reaction_clear_emoji_id: ['Reaction Cleared (Emoji)', 'When a specific reaction on a message is cleared.'],
    role_create_id: ['Role Created', 'When a new role is created.'],
    role_update_id: ['Role Updated', 'When a role is edited.'],
    role_delete_id: ['Role Deleted', 'When a role is deleted.'],
    scheduled_event_create_id: ['Scheduled Event Created', 'When a new scheduled event is created.'],
    scheduled_event_update_id: ['Scheduled Event Updated', 'When a scheduled event is edited.'],
    scheduled_event_delete_id: ['Scheduled Event Deleted', 'When a scheduled event is deleted.'],
    soundboard_sound_create_id: ['Soundboard Sound Created', 'When a new soundboard sound is created.'],
    soundboard_sound_update_id: ['Soundboard Sound Updated', 'When a soundboard sound is edited.'],
    soundboard_sound_delete_id: ['Soundboard Sound Deleted', 'When a soundboard sound is deleted.'],
    stage_instance_create_id: ['Stage Instance Created', 'When a user starts a stage instance.'],
    stage_instance_update_id: ['Stage Instance Updated', 'When a stage instance is edited.'],
    stage_instance_delete_id: ['Stage Instance Deleted', 'When a user finishes a stage instance.'],
    thread_create_id: ['Thread Created', 'When a user creates a new thread.'],
    thread_update_id: ['Thread Updated', 'When a user edits a thread.'],
    thread_delete_id: ['Thread Deleted', 'When a thread is deleted.'],
    voice_join_id: ['Voice Joined', 'When a user joins a voice channel.'],
    voice_leave_id: ['Voice Left', 'When a user leaves a voice channel.'],
    voice_move_id: ['Voice Moved', 'When a user moves / is moved to a different voice channel.'],
    voice_mute_id: ['Voice Muted', 'When a user is muted server wide by a moderator.'],
    voice_unmute_id: ['Voice Unmuted', 'When a user is unmuted server wide by a moderator.'],
    voice_deafen_id: ['Voice Deafened', 'When a user is deafened server wide by a moderator.'],
    voice_undeafen_id: ['Voice Undeafened', 'When a user is undeafened server wide by a moderator.'],
    titanium_warn_id: ['Titanium Warn', 'When a user is warned using Titanium.'],
    titanium_mute_id: ['Titanium Mute', 'When a user is muted using Titanium.'],
    titanium_unmute_id: ['Titanium Unmute', 'When a user is unmuted using Titanium.'],
    titanium_kick_id: ['Titanium Kick', 'When a user is kicked using Titanium.'],
    titanium_ban_id: ['Titanium Ban', 'When a user is banned using Titanium.'],
    titanium_unban_id: ['Titanium Unban', 'When a user is unbanned using Titanium.'],
    titanium_case_delete_id: ['Titanium Case Deleted', 'When a moderator deletes a Titanium case.'],
    titanium_case_comment_id: ['Titanium Case Commented', 'When a moderator comments on a Titanium case.'],
    titanium_automod_trigger_id: ['Titanium AutoMod Triggered', 'When a message triggers a Titanium AutoMod rule.'],
    titanium_bouncer_trigger_id: ['Titanium Bouncer Triggered', 'When a user triggers a Titanium Bouncer action.'],
    titanium_confession_id: ['Titanium Confession Posted', 'When a confession is posted using the confessions feature.']
  };

  $effect(() => {
    if (selectAllChannel) {
      for (const logType of Object.keys(logTypeStrings)) {
        dataState.pageSettings[logType as keyof LoggingConfigSchema] = selectAllChannel;
      }
    }
  });
</script>

{#snippet logTypeRow(logType: string)}
  <li
    class="xs:flex-row xs:items-center xs:justify-between xs:gap-2 flex w-full flex-col gap-1 rounded-lg bg-zinc-700 p-2 px-4"
  >
    <div>
      <p class="font-bold">{logTypeStrings[logType][0]}</p>
      <p class="text-base text-zinc-400">{logTypeStrings[logType][1]}</p>
    </div>

    <div class="flex shrink-0 flex-wrap items-center gap-2 overflow-auto">
      {#if dataState.pageSettings[logType as keyof LoggingConfigSchema]}
        <Button
          onclick={() => {
            dataState.pageSettings[logType as keyof LoggingConfigSchema] = undefined;
          }}
          class="bg-zinc-800 p-2"
          border={false}
        >
          <X size={20} />
        </Button>
      {/if}

      <ChannelButton
        categories={data.serverInfo.categories}
        bind:channel={dataState.pageSettings[logType as keyof LoggingConfigSchema] as string}
        class="bg-zinc-800"
      />
    </div>
  </li>
{/snippet}

{#snippet logCategoryList(category: string)}
  <ul class="flex flex-col gap-2">
    {#each Object.keys(logTypeStrings) as logType (logType)}
      {#if logType.startsWith(category)}
        {@render logTypeRow(logType)}
      {/if}
    {/each}
  </ul>
{/snippet}

<Saver page="logging" {data} bind:dataState />

{#if overlayOpen}
  <ChannelPicker categories={data.serverInfo.categories} bind:selectedChannel={selectAllChannel} bind:overlayOpen />
{/if}

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Logging</h2>
    <p>Set log channels for various events that happen in your server.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.logging} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.logging}>
  <div class="flex items-center gap-2">
    <Button
      onclick={() => {
        overlayOpen = true;
      }}
    >
      <ListPlus size={20} />
      Set All Channels
    </Button>

    <Button
      onclick={() => {
        for (const logType of Object.keys(logTypeStrings)) {
          dataState.pageSettings[logType as keyof LoggingConfigSchema] = null;
        }
      }}
    >
      <ListX size={20} />
      Clear All
    </Button>
  </div>

  <Collapsible title="Titanium" defaultState={page.url.hash === '#titanium' ? true : false}>
    {@render logCategoryList('titanium_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="App Commands">
    {@render logCategoryList('app_command_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Discord AutoMod">
    {@render logCategoryList('dc_automod_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Channels">
    {@render logCategoryList('channel_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Server Settings">
    {@render logCategoryList('guild_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Members">
    {@render logCategoryList('member_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Messages">
    {@render logCategoryList('message_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Polls">
    {@render logCategoryList('poll_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Reactions">
    {@render logCategoryList('reaction_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Roles">
    {@render logCategoryList('role_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Scheduled Events">
    {@render logCategoryList('scheduled_event_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Soundboard">
    {@render logCategoryList('soundboard_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Stage Instances">
    {@render logCategoryList('stage_instance_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Threads">
    {@render logCategoryList('thread_')}
  </Collapsible>

  <hr class="border-zinc-500" />

  <Collapsible title="Voice">
    {@render logCategoryList('voice_')}
  </Collapsible>
</ToggledContent>
