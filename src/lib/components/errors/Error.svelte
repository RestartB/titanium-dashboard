<script lang="ts">
  import ButtonRow from '$lib/components/ui/row/ButtonRow.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

  import { Copy, Check, CircleQuestionMark } from '@lucide/svelte';
  import type { ErrorLog } from '$lib/interfaces/serverInfo';

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

{#snippet extraButton()}
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
{/snippet}

{#if overlayOpen}
  <FullscreenOverlay
    bind:overlayOpen
    title="Error Details"
    {extraButton}
    class="z-99"
    width={512}
    height={480}
    padding={16}
    gap={16}
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
  </FullscreenOverlay>
{/if}
