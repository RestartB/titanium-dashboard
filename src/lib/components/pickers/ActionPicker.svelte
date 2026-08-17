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
    Eraser,
    Smile
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
        role_ids: []
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

  type ActionType = AutomodActionSchema['type'] | BouncerActionSchema['type'];

  const commonActionTypes: {
    id: AutomodActionSchema['type'] & BouncerActionSchema['type'];
    name: string;
    desc: string;
    icon: Component;
  }[] = [
    {
      id: 'warn',
      name: 'Warn User',
      desc: 'Add a warning to the user.',
      icon: TriangleAlert
    },
    {
      id: 'mute',
      name: 'Timeout User',
      desc: 'Prevent the user from sending messages for a duration.',
      icon: Clock
    },
    {
      id: 'kick',
      name: 'Kick User',
      desc: 'Kick the user from the server.',
      icon: UserRoundX
    },
    {
      id: 'ban',
      name: 'Ban User',
      desc: 'Permanently ban the user from the server.',
      icon: Hammer
    },
    {
      id: 'add_role',
      name: 'Add Role',
      desc: 'Add a role to the user.',
      icon: Plus
    },
    {
      id: 'remove_role',
      name: 'Remove Role',
      desc: 'Remove a role from the user.',
      icon: Minus
    },
    {
      id: 'toggle_role',
      name: 'Toggle Role',
      desc: 'Add or remove a role from the user.',
      icon: ToggleRight
    }
  ];

  const automodActionTypes: {
    id: AutomodActionSchema['type'];
    name: string;
    desc: string;
    icon: Component;
  }[] = [
    {
      id: 'delete',
      name: 'Delete Message',
      desc: 'Remove the messages.',
      icon: Trash
    },
    {
      id: 'send_message',
      name: 'Send Message',
      desc: 'Send a message. Will not trigger if the message author is a bot.',
      icon: MessageCircle
    },
    {
      id: 'reaction',
      name: 'Add Reaction',
      desc: 'Add a reaction to the message.',
      icon: Smile
    },
    ...commonActionTypes
  ];

  const bouncerActionTypes: {
    id: BouncerActionSchema['type'];
    name: string;
    desc: string;
    icon: Component;
  }[] = [
    ...commonActionTypes,
    {
      id: 'reset_nick',
      name: 'Reset Nickname',
      desc: "Reset the user's nickname.",
      icon: Eraser
    }
  ];

  let actionTypes = $derived(type === 'automod' ? automodActionTypes : bouncerActionTypes);
  let filteredTypes = $derived(
    actionTypes.filter((action) => !rule.actions.map((ruleAction) => ruleAction.type).includes(action.id))
  );
</script>

{#snippet actionRow(type: ActionType, name: string, description: string, Icon: Component)}
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
  {#if filteredTypes.length === 0}
    <p class="m-2 mx-auto text-lg text-zinc-400">Nothing to show</p>
  {:else}
    {#each filteredTypes as actionType (actionType.id)}
      {@render actionRow(actionType.id, actionType.name, actionType.desc, actionType.icon)}
    {/each}
  {/if}
</FullscreenOverlay>
