<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

  import Duration from '$lib/components/ui/inputs/Duration.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import Button from './inputs/Button.svelte';
  import RoleTile from './discord/RoleTile.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import EmojiPicker from '$lib/components/pickers/EmojiPicker.svelte';
  import { Plus } from '@lucide/svelte';

  import type { ServerInfo } from '$lib/interfaces/serverInfo';
  import type { AutomodActionSchema } from '$lib/validators/automod';
  import type { BouncerActionSchema } from '$lib/validators/bouncer';

  let {
    actionKind,
    serverInfo,
    action = $bindable(),
    overlayOpen = $bindable(true)
  }: {
    actionKind: 'automod' | 'bouncer';
    serverInfo: ServerInfo;
    action: AutomodActionSchema | BouncerActionSchema;
    overlayOpen?: boolean;
  } = $props();

  let roleOverlayOpen = $state(false);
  let emojiPickerOpen = $state(false);

  function isAutomodReactionAction(action: AutomodActionSchema | BouncerActionSchema): action is AutomodActionSchema {
    return actionKind === 'automod' && action.type === 'reaction';
  }
</script>

{#if roleOverlayOpen}
  <RolePicker
    multiselect={true}
    roles={serverInfo.roles}
    bind:selectedRoles={action.role_ids}
    bind:overlayOpen={roleOverlayOpen}
  />
{/if}

{#if emojiPickerOpen && isAutomodReactionAction(action)}
  <EmojiPicker {serverInfo} bind:overlayOpen={emojiPickerOpen} bind:selectedEmoji={action.reaction} />
{/if}

<FullscreenOverlay title="Set Preferences" padding={16} gap={16} bind:overlayOpen>
  {#if action.type === 'send_message'}
    <div class="w-full text-left">
      <p class="font-medium">Message Content</p>
      <p class="mb-2 text-sm text-zinc-400">Set the content of the message to be sent.</p>
      <textarea class="w-full rounded-lg bg-zinc-800 p-2" rows={4} bind:value={action.message_content}></textarea>
    </div>

    <div class="flex w-full items-center justify-between gap-2">
      <div>
        <p class="font-medium">Send As Reply</p>
        <p class="mb-2 text-sm text-zinc-400">Whether to send the message as a reply to the original message.</p>
      </div>
      <Toggle bind:toggled={action.message_reply} />
    </div>

    {#if action.message_reply}
      <div class="flex w-full items-center justify-between gap-2">
        <div>
          <p class="font-medium">Mention User</p>
          <p class="mb-2 text-sm text-zinc-400">Whether to send the reply as a mention.</p>
        </div>
        <Toggle bind:toggled={action.message_mention} />
      </div>
    {/if}

    <div class="flex w-full items-center justify-between gap-2">
      <div>
        <p class="font-medium">Send Embed</p>
        <p class="mb-2 text-sm text-zinc-400">Whether to send the message as an embed.</p>
      </div>
      <Toggle bind:toggled={action.message_embed} />
    </div>

    {#if action.message_embed}
      <div class="w-full text-left">
        <p class="font-medium">Colour</p>
        <p class="mb-2 text-sm text-zinc-400">Set the colour of the embed.</p>
        <input
          type="color"
          class="h-11 w-full overflow-hidden rounded-lg border-2 border-zinc-600 bg-zinc-800 p-1"
          bind:value={action.embed_colour}
        />
      </div>
    {/if}
  {:else if action.type === 'mute' || action.type === 'ban'}
    <div class="w-full text-left">
      <p class="font-medium">Duration</p>
      <p class="mb-2 text-sm text-zinc-400">Set the duration for the punishment.</p>
      <Duration class="w-full p-2" border={false} bind:seconds={action.duration} />
    </div>
  {:else if action.type === 'add_role' || action.type === 'remove_role' || action.type === 'toggle_role'}
    <div class="w-full text-left">
      <p class="font-medium">Role</p>
      <p class="mb-2 text-sm text-zinc-400">Set up to 10 roles role to add, remove or toggle.</p>
      <div class="flex flex-wrap gap-2">
        {#if action.role_ids.length < 5}
          <Button smallPadding={true} onclick={() => (roleOverlayOpen = true)}><Plus size={20} /> Add roles...</Button>
        {/if}

        {#each action.role_ids as role (role)}
          {@const foundRole = serverInfo.roles.find((r) => r.id === role)}
          {#if foundRole}
            <RoleTile
              role={foundRole}
              deleteThis={() => {
                action.role_ids = action.role_ids.filter((r) => r !== role);
              }}
            />
          {/if}
        {/each}
      </div>
    </div>
  {:else if action.type === 'reaction' && isAutomodReactionAction(action)}
    <div class="w-full text-left">
      <p class="font-medium">Reaction</p>
      <p class="mb-2 text-sm text-zinc-400">Set the duration for the punishment.</p>

      <Button border={false} title="Select reaction" class="w-full" onclick={() => (emojiPickerOpen = true)}>
        {#if isNaN(Number(action.reaction))}
          {action.reaction}
        {:else}
          {@const emojiURL = serverInfo.emojis.find((e) => e.id === action.reaction)?.url}
          {#if emojiURL}
            <img src={emojiURL} alt="Custom Emoji" class="h-6 w-6 rounded-sm" />
          {/if}
        {/if}
        <Duration class="w-full p-2" border={false} bind:seconds={action.duration} />
      </Button>
    </div>
  {/if}

  <div class="w-full text-left">
    <p class="font-medium">Reason</p>
    <p class="mb-2 text-sm text-zinc-400">Set the reason for the action.</p>
    <input type="text" class="w-full rounded-lg bg-zinc-800 p-2" bind:value={action.reason} />
  </div>
</FullscreenOverlay>
