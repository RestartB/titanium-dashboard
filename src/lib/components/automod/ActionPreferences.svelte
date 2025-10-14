<script lang="ts">
  import RoleButton from '$lib/components/ui/discord/RoleButton.svelte';
  import { X } from '@lucide/svelte';
  import type { RoleInfo } from '$lib/types/serverInfo';
  import type { AutomodAction } from '$lib/types/automod';

  const multipliers = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
    mon: 2592000,
    y: 31536000
  };

  let {
    roles,
    action = $bindable(),
    overlayOpen = $bindable(true)
  }: { roles: RoleInfo[]; action: AutomodAction; overlayOpen?: boolean } = $props();

  let durationInput = $state('');

  $effect(() => {
    if (!durationInput) {
      action.duration = 0;
      return;
    }

    let newDuration = 0;
    const regex = /(\d+)(s|m|h|d|w|mon|y)/g;
    const matches = [...durationInput.matchAll(regex)];

    if (matches.length === 0) {
      action.duration = 0;
      return;
    }

    for (const match of matches) {
      const value = parseInt(match[1]);
      const unit = match[2];

      if (isNaN(value)) continue;
      newDuration += value * (multipliers[unit as keyof typeof multipliers] || 0);
    }

    action.duration = newDuration;
  });
</script>

<div
  class="flex w-full max-w-104 flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
>
  <div class="items-between flex w-full justify-center gap-2">
    <h2 class="text-xl font-bold">Set Preferences</h2>
    <button
      class="ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
      onclick={() => (overlayOpen = false)}
      aria-label="Close action selector"
    >
      <X class="h-6 w-6" />
    </button>
  </div>
  <div
    class="flex h-full max-h-98 min-h-98 w-full max-w-96 flex-shrink-0 flex-col rounded-xl border-2 border-zinc-600 bg-zinc-700"
  >
    <div class="flex flex-col items-center gap-4 p-4">
      {#if action.type === 'mute' || action.type === 'ban'}
        <div class="w-full text-left">
          <p class="font-medium">Duration</p>
          <p class="mb-2 text-sm text-zinc-400">
            Set the duration for the punishment (e.g., 1d5h30m).
          </p>
          <input
            type="text"
            class="w-full rounded-lg border-2 border-zinc-700 bg-zinc-800 p-2"
            bind:value={durationInput}
            placeholder="e.g. 5m, 1h30m, 2d"
          />
        </div>
      {:else if action.type.includes('role')}
        <div class="w-full text-left">
          <p class="font-medium">Role</p>
          <p class="mb-2 text-sm text-zinc-400">Set the role to add, remove or toggle.</p>
          <RoleButton {roles} bind:role={action.role_id} />
        </div>
      {/if}
      <div class="w-full text-left">
        <p class="font-medium">Reason</p>
        <p class="mb-2 text-sm text-zinc-400">Set the reason for the punishment.</p>
        <input
          type="text"
          class="w-full rounded-lg border-2 border-zinc-700 bg-zinc-800 p-2"
          bind:value={action.reason}
        />
      </div>
    </div>
  </div>
</div>
