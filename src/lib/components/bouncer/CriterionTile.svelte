<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import { Cog, X } from '@lucide/svelte';
  import type { BouncerCriteria } from '$lib/types/bouncer';
  import CriterionPreferences from './CriterionPreferences.svelte';

  let {
    criterion = $bindable(),
    deleteThis = () => {},
    overlayOpen = $bindable(false)
  }: {
    criterion: BouncerCriteria;
    deleteThis: () => void;
    overlayOpen?: boolean;
  } = $props();
</script>

{#if overlayOpen}
  <FullscreenOverlay bind:overlayOpen>
    <CriterionPreferences bind:criterion bind:overlayOpen />
  </FullscreenOverlay>
{/if}

<div
  class="flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
>
  <button onclick={() => (overlayOpen = true)}>
    <Cog size={16} />
  </button>
  <button onclick={deleteThis}>
    <X size={16} />
  </button>
  <p class="capitalize">{criterion.type.replaceAll('_', ' ')}</p>
</div>
