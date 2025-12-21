<script lang="ts">
  import { scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  import RoleButton from '$lib/components/ui/discord/RoleButton.svelte';
  import Duration from '$lib/components/ui/inputs/Duration.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import { X } from '@lucide/svelte';

  import type { RoleInfo } from '$lib/interfaces/serverInfo';
  import type { AutomodActionSchema } from '$lib/validators/automod';
  import type { BouncerActionSchema } from '$lib/validators/bouncer';

  let {
    roles,
    action = $bindable(),
    overlayOpen = $bindable(true)
  }: { roles: RoleInfo[]; action: AutomodActionSchema | BouncerActionSchema; overlayOpen?: boolean } = $props();
</script>

<div
  class="flex w-full max-w-104 flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
  transition:scale={{ duration: 300, easing: cubicOut, start: 0.9, opacity: 1 }}
>
  <div class="flex w-full items-center justify-between gap-2">
    <h2 class="text-xl font-bold">Set Preferences</h2>
    <button
      class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
      onclick={() => (overlayOpen = false)}
      aria-label="Close settings panel"
    >
      <X class="h-6 w-6" />
    </button>
  </div>

  <div
    class="flex h-full max-h-98 min-h-98 w-full max-w-96 shrink-0 flex-col overflow-auto rounded-xl border-2 border-zinc-600 bg-zinc-700"
  >
    <div class="flex flex-col items-center gap-4 p-4">
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
      {:else}
        {#if action.type === 'mute' || action.type === 'ban'}
          <div class="w-full text-left">
            <p class="font-medium">Duration</p>
            <p class="mb-2 text-sm text-zinc-400">Set the duration for the punishment.</p>
            <Duration class="w-full p-2" border={false} bind:seconds={action.duration} />
          </div>
        {:else if action.type.includes('role')}
          <div class="w-full text-left">
            <p class="font-medium">Role</p>
            <p class="mb-2 text-sm text-zinc-400">Set the role to add, remove or toggle.</p>
            <RoleButton class="w-full bg-zinc-800 p-2" {roles} bind:role={action.role_id} />
          </div>
        {/if}

        <div class="w-full text-left">
          <p class="font-medium">Reason</p>
          <p class="mb-2 text-sm text-zinc-400">Set the reason for the punishment.</p>
          <input type="text" class="w-full rounded-lg bg-zinc-800 p-2" bind:value={action.reason} />
        </div>
      {/if}
    </div>
  </div>
</div>
