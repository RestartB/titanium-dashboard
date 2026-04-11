<script lang="ts">
  import { onMount } from 'svelte';
  import { localStorageAvailable } from '$lib/helpers/storage';

  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import { Cog, LayoutDashboard, ThumbsUp, List, Code, Heart } from '@lucide/svelte';

  const currentId = '6d994cc2-c2df-411d-b04f-cbfe608f8f63';
  let overlayOpen = $state(false);

  onMount(() => {
    if (!localStorageAvailable()) {
      return;
    }

    const lastId = window.localStorage.getItem('announcement.lastId');
    const neverAgain = window.localStorage.getItem('announcement.neverAgain');

    if (neverAgain === 'true' || lastId === currentId) {
      return;
    }

    overlayOpen = true;
    window.localStorage.setItem('announcement.lastId', currentId);
  });
</script>

{#snippet buttons()}
  <div class="flex w-full items-center justify-end">
    <button
      class="w-fit cursor-pointer rounded-lg bg-zinc-700 p-1 px-2 transition-colors hover:bg-zinc-600"
      onclick={() => {
        overlayOpen = false;
        if (!localStorageAvailable()) {
          return;
        }

        window.localStorage.setItem('announcement.neverAgain', 'true');
      }}
    >
      Don't show again
    </button>
  </div>
{/snippet}

{#if overlayOpen}
  <FullscreenOverlay title="Announcement" width={600} height={700} bottomRow={buttons} bind:overlayOpen>
    <img
      src="/images/background_blur.svg"
      alt="Grey blurred gradient background"
      class="block h-40 w-full object-cover blur-lg"
    />

    <div class="mt-6 space-y-2 p-4">
      <h2 class="text-2xl font-bold">👋 Welcome to Titanium v2!</h2>
      <p>
        Titanium has been rewritten from the ground up, to better serve you and your servers. Enjoy existing features
        with major updates like the fireboard and leaderboard system, alongside major new modules such as moderation and
        logging. This update has been in the works since August 2025, featuring over 20,000 lines of code and a fully
        custom dashboard - I truly hope you enjoy it.
      </p>

      <hr class="my-4 border-zinc-500" />

      <ul class="space-y-4">
        <li class="flex items-center gap-4">
          <Cog size={25} class="shrink-0" />
          <p>9 modules to help you manage your server - including 5 new modules for v2</p>
        </li>
        <li class="flex items-center gap-4">
          <LayoutDashboard size={25} class="shrink-0" />
          <p>Brand new, fully custom web dashboard to change settings in Titanium easier</p>
        </li>
        <li class="flex items-center gap-4">
          <ThumbsUp size={25} class="shrink-0" />
          <p>All features from Titanium v1 maintained - user app compatibility, image commands, etc</p>
        </li>
        <li class="flex items-center gap-4">
          <List size={25} class="shrink-0" />
          <p>Large list of ideas and feature drops to come in future updates</p>
        </li>
        <li class="flex items-center gap-4">
          <Code size={25} class="shrink-0" />
          <p>All code is open source for transparency, to allow for anyone to see and read it</p>
        </li>
        <li class="flex items-center gap-4">
          <Heart size={25} class="shrink-0" />
          <p>Thank you - your support helps me continue to develop Titanium for everyone</p>
        </li>
      </ul>
    </div>
  </FullscreenOverlay>
{/if}
