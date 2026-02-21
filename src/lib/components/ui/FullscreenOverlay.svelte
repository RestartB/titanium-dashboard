<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  import { X } from '@lucide/svelte';
  import type { Snippet } from 'svelte';

  let {
    children,
    extraButton,
    title,
    width = 466,
    height = 564,
    padding = 0,
    gap = 0,
    zIndex = 50,
    class: className = '',
    overlayOpen = $bindable(false)
  }: {
    children?: Snippet<[]>;
    extraButton?: Snippet<[]>;
    title?: string;
    width?: number;
    height?: number;
    padding?: number;
    gap?: number;
    zIndex?: number;
    class?: string;
    overlayOpen?: boolean;
  } = $props();
</script>

<div
  class="fixed inset-0 isolate flex flex-col items-center justify-center overflow-hidden bg-black/60 p-4 pt-16 backdrop-blur-lg {className}"
  style="z-index: {zIndex}"
  transition:fade={{ duration: 100 }}
>
  <div class="absolute inset-0 -z-10" onclick={() => (overlayOpen = false)} aria-hidden="true"></div>

  <div
    class="flex flex-col gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
    style="width: min({width}px, 100%); height: min({height}px, calc(100vh - 3rem)); max-height: calc(100vh - 3rem);"
    transition:scale={{ duration: 300, easing: cubicOut, start: 0.9, opacity: 1 }}
  >
    <div class="flex w-full shrink-0 items-center justify-between gap-2">
      <h2 class="text-xl font-bold">{title}</h2>
      {@render extraButton?.()}
      <button
        class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
        onclick={() => (overlayOpen = false)}
        aria-label="Close popup"
      >
        <X size={24} />
      </button>
    </div>

    <div
      class="flex w-full flex-1 flex-col overflow-auto rounded-xl border-2 border-zinc-600 bg-zinc-700"
      style="padding: {padding}px; gap: {gap}px;"
    >
      {@render children?.()}
    </div>
  </div>
</div>
