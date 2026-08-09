<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

  import { UserPlus, UserPen, Frown } from '@lucide/svelte';
  import type { Component } from 'svelte';
  import type { BouncerRuleSchema } from '$lib/validators/bouncer';

  let { rule = $bindable(), overlayOpen = $bindable(true) }: { rule: BouncerRuleSchema; overlayOpen?: boolean } =
    $props();

  const ruleTriggers: {
    id: 'member_join' | 'member_update' | 'suspicious_reaction';
    name: string;
    desc: string;
    icon: Component;
  }[] = [
    {
      id: 'member_join',
      name: 'Member Join',
      desc: 'When a user joins the server.',
      icon: UserPlus
    },
    {
      id: 'member_update',
      name: 'Member Update',
      desc: 'When a member updates their profile.',
      icon: UserPen
    },
    {
      id: 'suspicious_reaction',
      name: 'Suspicious Reaction',
      desc: 'When a member reacts to a message within 5 seconds after joining.',
      icon: Frown
    }
  ];

  let filteredTriggers = $derived(ruleTriggers.filter((trigger) => !rule[trigger.id]));
</script>

{#snippet triggerRow(
  type: 'member_join' | 'member_update' | 'suspicious_reaction',
  name: string,
  description: string,
  Icon: Component
)}
  <button
    class="flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 px-4 transition-all hover:bg-zinc-800"
    onclick={() => {
      rule[type] = true;
      overlayOpen = false;
    }}
    aria-label="Select {name} trigger"
  >
    <Icon size={24} />
    <div class="w-full text-left">
      <p class="font-medium">{name}</p>
      <p class="text-sm text-zinc-400">{description}</p>
    </div>
  </button>
{/snippet}

<FullscreenOverlay title="Select a Trigger" padding={8} gap={8} bind:overlayOpen>
  {#if filteredTriggers.length === 0}
    <p class="m-2 mx-auto text-lg text-zinc-400">Nothing to show</p>
  {:else}
    {#each filteredTriggers as triggerType (triggerType.id)}
      {@render triggerRow(triggerType.id, triggerType.name, triggerType.desc, triggerType.icon)}
    {/each}
  {/if}
</FullscreenOverlay>
