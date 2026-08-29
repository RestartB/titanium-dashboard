<script lang="ts">
  import { onMount } from 'svelte';
  import { localStorageAvailable } from '$lib/helpers/storage';

  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import { CircleQuestionMark } from '@lucide/svelte';

  const currentId = '1';
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
    <div class="relative blur-lg">
      <span class="absolute inset-0 z-10 block bg-red-500 opacity-20"></span>
      <img
        src="/images/background_blur.svg"
        alt="Grey blurred gradient background"
        class="block h-40 w-full object-cover"
      />
    </div>

    <div class="mt-6 space-y-2 p-4">
      <h2 class="text-2xl font-bold">🚨 Prefix Commands Removal</h2>
      <p>
        Due to Discord restrictions, prefix commands will be removed from Titanium between the middle and the end of
        September. Slash commands will become the only way to interact with Titanium.
      </p>

      <hr class="my-4 border-zinc-500" />

      <ul class="space-y-4">
        <li class="flex items-center gap-4">
          <CircleQuestionMark size={25} class="shrink-0" />
          <div>
            <h3 class="font-bold">What are slash commands?</h3>
            <p>
              Slash commands always begin with <code>/</code>. When you type <code>/</code>, you will see a list of
              commands that you can select from.
            </p>
          </div>
        </li>

        <li class="flex items-center gap-4">
          <CircleQuestionMark size={25} class="shrink-0" />
          <div>
            <h3 class="font-bold">What benefits do slash commands provide?</h3>
            <p>
              Slash commands allow you to easily find commands (though a built in command list), allow you to pick what
              arguments you want to use and in what order, and allow for easy permission management via hiding /
              blocking commands for certain roles and channels.
            </p>
          </div>
        </li>

        <li class="flex items-center gap-4">
          <CircleQuestionMark size={25} class="shrink-0" />
          <div>
            <h3 class="font-bold">Why?</h3>
            <p>
              Discord are heavily cracking down on prefix commands to make everyone switch to slash commands. If your
              bot has prefix commands, there is a high chance your bot will not be allowed to access message content,
              which will break several Titanium features.
            </p>
          </div>
        </li>

        <li class="flex items-center gap-4">
          <CircleQuestionMark size={25} class="shrink-0" />
          <div>
            <h3 class="font-bold">Will I be warned in the bot?</h3>
            <p>
              Yes. I have added several warnings to Titanium to show that prefix commands will be going away. I will
              also add a warning that is displayed once prefix commands have been fully removed.
            </p>
          </div>
        </li>
      </ul>

      <hr class="my-4 border-zinc-500" />

      For more information, please join Titanium's support server.
    </div>
  </FullscreenOverlay>
{/if}
