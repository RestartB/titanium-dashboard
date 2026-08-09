<script lang="ts">
  import { Cog, X } from '@lucide/svelte';
  import type { BouncerCriterionSchema } from '$lib/validators/bouncer';
  import CriterionPreferences from './CriterionPreferences.svelte';

  let {
    criterion = $bindable(),
    limit,
    enforcingLimit,
    deleteThis = () => {},
    overlayOpen = $bindable(false)
  }: {
    criterion: BouncerCriterionSchema;
    limit: number;
    enforcingLimit: boolean;
    deleteThis: () => void;
    overlayOpen?: boolean;
  } = $props();
</script>

{#if overlayOpen}
  <CriterionPreferences {limit} {enforcingLimit} bind:criterion bind:overlayOpen />
{/if}

<div class="flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base">
  {#if criterion.type !== 'avatar'}
    <button onclick={() => (overlayOpen = true)} aria-label="Open criterion preferences" class="cursor-pointer">
      <Cog size={16} />
    </button>
  {/if}
  <button onclick={deleteThis} aria-label="Delete criterion" class="cursor-pointer">
    <X size={16} />
  </button>

  <p class="capitalize">{criterion.type.replaceAll('_', ' ')}</p>
</div>
