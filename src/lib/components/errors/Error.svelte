<script lang="ts">
  import ButtonRow from '$lib/components/ui/row/ButtonRow.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

  import { scale } from 'svelte/transition';

  import { Copy, Check, X, CircleQuestionMark } from '@lucide/svelte';
  import type { ErrorLog } from '$lib/interfaces/serverInfo';
  import { cubicOut } from 'svelte/easing';

  const { error }: { error: ErrorLog } = $props();
  let overlayOpen = $state(false);
  let isCopied = $state(false);
</script>

<ButtonRow label="View error details" Icon={CircleQuestionMark} onclick={() => (overlayOpen = true)}>
  <p class="text-base text-zinc-400">
    <strong>{error.module} - {new Date(error.time_occurred).toLocaleString()}</strong>
  </p>
  <p class="font-semibold">{error.error}</p>
</ButtonRow>

{#if overlayOpen}
  <FullscreenOverlay {overlayOpen}>
    <div
      class="flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
      transition:scale={{ duration: 300, easing: cubicOut, start: 0.9, opacity: 1 }}
    >
      <div class="flex w-full items-center justify-between gap-2">
        <h2 class="text-xl font-bold">Error</h2>
        <button
          class="ml-auto flex h-8 w-24 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 p-2 text-zinc-400 hover:bg-zinc-600"
          onclick={() =>
            navigator.clipboard.writeText(error.id).then(() => {
              isCopied = true;
              setTimeout(() => (isCopied = false), 3000);
            })}
          aria-label="Copy ID to clipboard"
        >
          {#if isCopied}
            <p class="mr-2">Done</p>
            <Check size={20} />
          {:else}
            <p class="mr-2">Copy</p>
            <Copy size={20} />
          {/if}
        </button>
        <button
          class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
          onclick={() => (overlayOpen = false)}
          aria-label="Close popup"
        >
          <X size={24} />
        </button>
      </div>

      <div
        class="flex h-full max-h-120 min-h-120 w-full max-w-120 shrink-0 flex-col gap-4 overflow-auto rounded-xl border-2 border-zinc-600 bg-zinc-700 p-4"
      >
        <div>
          <h3 class="font-bold">Module</h3>
          <p>{error.module}</p>
        </div>

        <div>
          <h3 class="font-bold">Error</h3>
          <p>{error.error}</p>
        </div>

        {#if error.details}
          <div>
            <h3 class="font-bold">Info</h3>
            <p>{error.details}</p>
          </div>
        {/if}

        <div>
          <h3 class="font-bold">Time</h3>
          <p>{new Date(error.time_occurred).toLocaleString()}</p>
        </div>

        <p class="mt-auto text-center font-mono text-sm text-zinc-400">{error.id}</p>
      </div>
    </div>
  </FullscreenOverlay>
{/if}
