<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

  import {
    Trash,
    TriangleAlert,
    Clock,
    UserRoundX,
    Hammer,
    Plus,
    Minus,
    ToggleRight,
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

  function createBlankAction(actionType: AutomodActionSchema['type'] | BouncerActionSchema['type']) {
    if (type === 'bouncer') {
      return {
        type: actionType,
        duration: null,
        role_id: null,
        reason: ''
      } as BouncerActionSchema;
    }

    return {
      type: actionType,
      role_ids: [],
      message_reply: true,
      message_mention: true,
      message_embed: false
    } as AutomodActionSchema;
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

<FullscreenOverlay bind:overlayOpen title="Select an Action" padding={8} gap={8}>
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
</FullscreenOverlay>
