<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  import {
    Trash,
    TriangleAlert,
    Clock,
    UserRoundX,
    Hammer,
    Plus,
    Minus,
    ToggleRight,
    X,
    MessageCircle,
    Eraser
  } from '@lucide/svelte';

  import type { Component } from 'svelte';
  import type { AutomodActionSchema, AutomodRuleSchema } from '$lib/validators/automod';
  import type { BouncerActionSchema, BouncerRuleSchema } from '$lib/validators/bouncer';

  let {
    type = 'automod',
    rule = $bindable(),
    overlayOpen = $bindable(true)
  }: { type: 'automod' | 'bouncer'; rule: AutomodRuleSchema | BouncerRuleSchema; overlayOpen?: boolean } = $props();

  function createBlankAction(
    type: AutomodActionSchema['type'] | BouncerActionSchema['type']
  ): AutomodActionSchema | BouncerActionSchema {
    return {
      type: type,
      duration: null,
      reason: '',
      message_content: '',
      message_reply: true,
      message_mention: true,
      message_embed: false,
      embed_colour: ''
    };
  }
</script>

{#snippet actionRow(
  type: AutomodActionSchema['type'] | BouncerActionSchema['type'],
  name: string,
  description: string,
  Icon: Component
)}
  <button
    class="flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 px-4 transition-all hover:bg-zinc-800"
    onclick={() => {
      const action = createBlankAction(type);
      rule.actions = [...(rule.actions || []), action] as typeof rule.actions;
      overlayOpen = false;
    }}
    aria-label="Select {name} action"
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
  transition:scale={{ duration: 300, easing: cubicOut, start: 0.9, opacity: 1 }}
>
  <div class="flex w-full items-center justify-between gap-2">
    <h2 class="text-xl font-bold">Select an Action</h2>
    <button
      class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
      onclick={() => (overlayOpen = false)}
      aria-label="Close action selector"
    >
      <X class="h-6 w-6" />
    </button>
  </div>
  <div
    class="flex h-full max-h-104 min-h-104 w-full max-w-96 shrink-0 flex-col rounded-xl border-2 border-zinc-600 bg-zinc-700"
  >
    <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
      {#if type === 'automod'}
        {@render actionRow('delete', 'Delete Message', 'Remove the messages.', Trash)}
        {@render actionRow('send_message', 'Send Message', 'Send a message.', MessageCircle)}
      {/if}
      {@render actionRow('warn', 'Warn User', 'Add a warning to the user.', TriangleAlert)}
      {@render actionRow('mute', 'Timeout User', 'Prevent the user from sending messages for a duration.', Clock)}
      {@render actionRow('kick', 'Kick User', 'Kick the user from the server.', UserRoundX)}
      {@render actionRow('ban', 'Ban User', 'Permanently ban the user from the server.', Hammer)}
      {#if type === 'bouncer'}
        {@render actionRow('reset_nick', 'Reset Nickname', "Reset the user's nickname.", Eraser)}
      {/if}
      {@render actionRow('add_role', 'Add Role', 'Add a role to the user.', Plus)}
      {@render actionRow('remove_role', 'Remove Role', 'Remove a role from the user.', Minus)}
      {@render actionRow('toggle_role', 'Toggle Role', 'Add or remove a role from the user.', ToggleRight)}
    </div>
  </div>
</div>
