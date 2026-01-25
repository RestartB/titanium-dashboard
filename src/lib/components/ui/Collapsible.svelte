<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { ChevronDown } from '@lucide/svelte';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { children, title, defaultState = false }: { children?: any; title: string; defaultState?: boolean } = $props();

  // default open when there's no client side js
  let isOpen = $state(true);

  onMount(() => {
    isOpen = defaultState;
  });
</script>

<div class="w-full">
  <button
    class="flex w-full cursor-pointer items-center justify-between py-1"
    onclick={() => (isOpen = !isOpen)}
    aria-label="Toggle {title} section"
  >
    <h3 class="font-bold">{title}</h3>
    <ChevronDown class="shrink-0 transition-transform duration-400 {isOpen ? 'rotate-180' : ''}" />
  </button>

  {#if isOpen}
    <div class="mt-2" transition:slide>
      {@render children?.()}
    </div>
  {/if}
</div>
