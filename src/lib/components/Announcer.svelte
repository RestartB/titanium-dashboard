<script lang="ts">
  import { onMount } from 'svelte';
  import { localStorageAvailable } from '$lib/helpers/storage';

  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import { Trophy, Globe, Shield, Mic, Bell, Brain, HatGlasses, Bug } from '@lucide/svelte';

  const currentId = '58daca4d-58fa-4856-93fa-f261575ea6ce';
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
      <h2 class="text-2xl font-bold">📢 Recent Updates</h2>
      <p>
        Titanium has received various updates over the past few months to make it better for you, based on
        planned ideas and various suggestions.
      </p>

      <hr class="my-4 border-zinc-500" />

      <ul class="space-y-4">
        <li class="flex items-center gap-4">
          <Trophy size={25} class="shrink-0" />
          <p>Level roles - assign roles when a user levels up</p>
        </li>
        <li class="flex items-center gap-4">
          <Globe size={25} class="shrink-0" />
          <p>Web leaderboard - view your server's leaderboard in the browser</p>
        </li>
        <li class="flex items-center gap-4">
          <Shield size={25} class="shrink-0" />
          <p>Mass punish commands to punish up to 20 users at once</p>
        </li>
        <li class="flex items-center gap-4">
          <Mic size={25} class="shrink-0" />
          <p>Voice Chat XP - track VC time and add XP based on your time in VC</p>
        </li>
        <li class="flex items-center gap-4">
          <Bell size={25} class="shrink-0" />
          <p>Reminders - set reminders that send in servers or DMs</p>
        </li>
        <li class="flex items-center gap-4">
          <Brain size={25} class="shrink-0" />
          <p>New automod - create fully custom rules, with criteria and actions</p>
        </li>
        <li class="flex items-center gap-4">
          <HatGlasses size={25} class="shrink-0" />
          <p>Anonymous Polls - create fully anonymous polls using the confessions feature</p>
        </li>
        <li class="flex items-center gap-4">
          <Bug size={25} class="shrink-0" />
          <p>40+ bug fixes and improvements</p>
        </li>
      </ul>
    </div>
  </FullscreenOverlay>
{/if}
