<script lang="ts">
  import {
    Trash,
    TriangleAlert,
    Clock,
    UserRoundX,
    Hammer,
    Plus,
    Minus,
    ToggleRight,
    X
  } from '@lucide/svelte';
  import type { Component } from 'svelte';
  import type { AutomodAction, AutomodRule } from '$lib/types/automod';

  let {
    rule = $bindable(),
    overlayOpen = $bindable(true)
  }: { rule: AutomodRule; overlayOpen?: boolean } = $props();

  function createBlankAction(): AutomodAction {
    return {
      type: '',
      duration: 0,
      reason: ''
    };
  }
</script>

{#snippet actionRow(type: string, name: string, description: string, Icon: Component)}
  <button
    class="flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 px-4 transition-all hover:bg-zinc-800"
    onclick={() => {
      const action = createBlankAction();
      action.type = type;
      rule.actions = [...(rule.actions || []), action];
      overlayOpen = false;
    }}
  >
    <Icon size={24} />
    <div class="w-full text-left">
      <p class="font-medium">{name}</p>
      <p class="text-sm text-zinc-400">{description}</p>
    </div>
  </button>
{/snippet}

<div
  class="flex w-full max-w-104 flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
>
  <div class="items-center flex w-full justify-between gap-2">
    <h2 class="text-xl font-bold">Select an Action</h2>
    <button
      class="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
      onclick={() => (overlayOpen = false)}
      aria-label="Close action selector"
    >
      <X class="h-6 w-6" />
    </button>
  </div>
  <div
    class="flex h-full max-h-98 min-h-98 w-full max-w-96 flex-shrink-0 flex-col rounded-xl border-2 border-zinc-600 bg-zinc-700"
  >
    <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
      {@render actionRow('delete', 'Delete Message', 'Remove the messages.', Trash)}
      {@render actionRow('warn', 'Warn User', 'Add a warning to the user.', TriangleAlert)}
      {@render actionRow(
        'mute',
        'Timeout User',
        'Prevent the user from sending messages for a duration.',
        Clock
      )}
      {@render actionRow('kick', 'Kick User', 'Kick the user from the server.', UserRoundX)}
      {@render actionRow('ban', 'Ban User', 'Permanently ban the user from the server.', Hammer)}
      {@render actionRow('add_role', 'Add Role', 'Add a role to the user.', Plus)}
      {@render actionRow('remove_role', 'Remove Role', 'Remove a role from the user.', Minus)}
      {@render actionRow(
        'toggle_role',
        'Toggle Role',
        'Add or remove a role from the user.',
        ToggleRight
      )}
    </div>
  </div>
</div>
