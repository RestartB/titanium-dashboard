<script lang="ts">
  import { sidebarState } from '$lib/states/sidebar.svelte';
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import { fade } from 'svelte/transition';
  import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
  let { children, data } = $props();

  let serverInfo = data.serverInfo;
  let width: number = $state(840);

  afterNavigate(() => {
    sidebarState.open = false;
  });

  let isHome = $derived(
    page.url.pathname.split('/')[page.url.pathname.split('/').length - 1] !== data.serverInfo.id
  );
</script>

<svelte:window bind:innerWidth={width} />

<div class="flex h-full justify-center">
  <div class="flex w-full max-w-7xl">
    {#if width >= 840}
      <div class="hidden w-full max-w-2xs sidebar:block">
        <Sidebar {serverInfo} />
      </div>
    {:else if sidebarState.open}
      <div
        class="fixed inset-0 isolate z-50 mt-12 overflow-y-auto bg-white/60 backdrop-blur-lg dark:bg-black/60"
        transition:fade={{ duration: 100 }}
      >
        <div
          class="absolute inset-0 -z-10"
          onclick={() => (sidebarState.open = false)}
          aria-hidden="true"
        ></div>
        <Sidebar {serverInfo} />
      </div>
    {/if}

    <div class="flex w-full flex-col gap-4 overflow-y-auto p-4 {isHome ? 'pb-35' : ''}">
      {@render children?.()}
    </div>
  </div>
</div>
