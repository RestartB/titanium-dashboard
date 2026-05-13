<script lang="ts">
  import FullscreenOverlay from './FullscreenOverlay.svelte';

  let { amount, limit }: { amount: number; limit: number } = $props();
  let overlayOpen = $state(false);
</script>

{#snippet buttons()}
  <div class="flex w-full items-center justify-end">
    <a
      href="https://titaniumbot.me/server"
      target="_blank"
      class="w-fit cursor-pointer rounded-lg bg-zinc-700 p-1 px-2 transition-colors hover:bg-zinc-600"
    >
      Support Server
    </a>
  </div>
{/snippet}

{#if overlayOpen}
  <FullscreenOverlay title="Limits" padding={16} bottomRow={buttons} bind:overlayOpen>
    <h2 class="text-2xl font-bold">Limits help protect Titanium.</h2>
    <p>
      Some features in Titanium have limits - a certain amount of levels, a certain amount of rules, etc. This helps to
      protect Titanium's services from abuse and overuse.
    </p>
    <h3 class="mt-4 text-xl font-semibold">Reached a limit?</h3>
    <p>
      No need to worry! Simply join our support server, and request an increased limit on a feature of your choice, for
      free.
    </p>

    <p class="mt-auto text-base text-zinc-300">Limits increase requests are reviewed on a case by case basis.</p>
  </FullscreenOverlay>
{/if}

<button
  class="flex w-fit cursor-pointer items-center justify-center gap-1 rounded-full border-2 border-zinc-700 p-1 px-4 text-base transition-colors"
  class:bg-zinc-800={amount < limit}
  class:bg-red-900={amount >= limit}
  onclick={() => (overlayOpen = true)}
  aria-label="Open limits information"
>
  <p>{amount} <b>/</b> {limit}</p>
  <span class="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600 text-center text-xl font-bold">i</span>
</button>
