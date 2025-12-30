<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  import { X } from '@lucide/svelte';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let {
    children,
    extraButton,
    title,
    width = 430,
    height = 480,
    padding = 0,
    gap = 0,
    class: className = '',
    overlayOpen = $bindable(false)
  }: {
    children?: any;
    extraButton?: any;
    title?: string;
    width?: number;
    height?: number;
    padding?: number;
    gap?: number;
    class?: string;
    overlayOpen?: boolean;
  } = $props();
</script>

<div
  class="fixed inset-0 isolate z-50 mt-12 flex flex-col items-center justify-center overflow-hidden bg-black/60 p-4 backdrop-blur-lg {className}"
  transition:fade={{ duration: 100 }}
>
  <div class="absolute inset-0 -z-10" onclick={() => (overlayOpen = false)} aria-hidden="true"></div>

  <div
    class="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
    transition:scale={{ duration: 300, easing: cubicOut, start: 0.9, opacity: 1 }}
  >
    <div class="flex w-full items-center justify-between gap-2">
      <h2 class="text-xl font-bold">{title}</h2>
      {@render extraButton?.()}
      <button
        class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
        onclick={() => (overlayOpen = false)}
        aria-label="Close error popup"
      >
        <X size={24} />
      </button>
    </div>

    <div
      class="flex h-full w-full shrink-0 flex-col overflow-auto rounded-xl border-2 border-zinc-600 bg-zinc-700"
      style="min-height: {height}px; max-height: {height}px; min-width: {width}px; max-width: {width}px; padding: {padding}px; gap: {gap}px;"
    >
      {@render children?.()}
    </div>
  </div>
</div>
