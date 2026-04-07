<script lang="ts">
  import { sidebarState } from '$lib/states/sidebar.svelte';
  import { afterNavigate } from '$app/navigation';
  import { page, navigating } from '$app/state';
  import { fade } from 'svelte/transition';

  import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import FeatureAnnouncer from '$lib/components/Announcer.svelte';

  let { children, data } = $props();

  let serverInfo = data.serverInfo;
  let width: number = $state(840);

  afterNavigate(() => {
    sidebarState.open = false;
  });

  let isHome = $derived(page.url.pathname.split('/')[page.url.pathname.split('/').length - 1] !== data.serverInfo.id);

  $effect(() => {
    if (sidebarState.open && width >= 840) {
      sidebarState.open = false;
    }
  });
</script>

<svelte:window bind:innerWidth={width} />

<FeatureAnnouncer />

<div class="flex h-full justify-center">
  <div class="flex w-full max-w-7xl">
    {#if !data.cases_only}
      {#if width >= 840}
        <div class="hidden w-full max-w-2xs overflow-y-auto sidebar:block">
          <Sidebar {serverInfo} />
        </div>
      {:else if sidebarState.open}
        <div
          class="fixed inset-0 isolate z-50 mt-12 overflow-y-auto bg-black/60 backdrop-blur-lg"
          transition:fade={{ duration: 100 }}
        >
          <div class="absolute inset-0 -z-10" onclick={() => (sidebarState.open = false)} aria-hidden="true"></div>
          <Sidebar {serverInfo} />
        </div>
      {/if}
    {/if}

    <div
      class="flex w-full flex-col gap-4 overflow-y-auto p-4 transition-opacity {isHome ? 'pb-35' : ''}"
      class:opacity-50={navigating.type &&
        navigating.from &&
        navigating.to &&
        navigating.from.url.href !== navigating.to.url.href}
      class:pointer-events-none={navigating.type &&
        navigating.from &&
        navigating.to &&
        navigating.from.url.href !== navigating.to.url.href}
    >
      <noscript>
        <Alert class="bg-yellow-800/50">
          <p>
            <strong>Javascript is disabled in your browser.</strong> The dashboard will function in a limited read only mode.
          </p>
        </Alert>
      </noscript>

      {@render children?.()}
    </div>
  </div>
</div>
