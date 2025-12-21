<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import { afterNavigate } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';
  import { prefersReducedMotion } from 'svelte/motion';
  import { sidebarState } from '$lib/states/sidebar.svelte';

  import Avatar from '$lib/components/ui/Avatar.svelte';
  import { PanelLeft, X, Menu, Server, LifeBuoy, LogOut, LogIn } from '@lucide/svelte';
  import logo from '$lib/assets/logo.svg';

  import type { UserInfo } from '$lib/interfaces/userInfo';

  const { userData }: { userData?: UserInfo | null | undefined } = $props();
  const shortUserData = userData?.userData;

  let menuOpen = $state(false);
  let pageWithSidebar = $derived(page.url.pathname.startsWith('/guild/'));

  afterNavigate(() => {
    menuOpen = false;
  });
</script>

<header
  class="fixed z-100 h-12 w-full border-b-2 border-b-zinc-700 bg-zinc-800 text-base"
  style="view-transition-name: header"
>
  <div class="mx-auto flex h-full max-w-7xl items-center">
    <div class="flex h-full items-center">
      {#if pageWithSidebar}
        <button
          class="cursor-pointer p-4 sidebar:hidden"
          onclick={() => (sidebarState.open = !sidebarState.open)}
          aria-label="{sidebarState.open ? 'Close' : 'Open'} sidebar"
        >
          {#if sidebarState.open}
            <span in:fade={{ duration: 100 }}>
              <X class="h-6 w-6 shrink-0" />
            </span>
          {:else}
            <span in:fade={{ duration: 100 }}>
              <PanelLeft class="h-6 w-6 shrink-0" />
            </span>
          {/if}
        </button>
      {/if}

      <div class="mr-2 flex items-center gap-2 {pageWithSidebar ? 'sidebar:pl-4' : 'pl-4'}">
        <img src={logo} alt="Titanium" class="h-8 w-8 rounded-md" translate="no" />
        <h1 class="text-lg font-bold" translate="no">Titanium</h1>
        <div class="rounded-lg bg-zinc-700 p-1 px-2 text-base font-semibold text-zinc-400 select-none" translate="no">
          Beta
        </div>
      </div>

      {#if userData}
        <a
          href={resolve('/')}
          class="hidden h-full items-center border-y-transparent border-b-zinc-500 px-2 transition-all hover:border-y-4 xxs:flex"
          >Servers</a
        >
      {/if}
      <a
        href="https://titaniumbot.me/server"
        target="_blank"
        class="hidden h-full items-center border-y-transparent border-b-zinc-500 px-2 transition-all hover:border-y-4 xxs:flex"
        >Support</a
      >
    </div>

    <div class="ml-auto flex items-center gap-2">
      {#if shortUserData}
        <Avatar
          src={shortUserData.avatar
            ? `https://cdn.discordapp.com/avatars/${shortUserData.id}/${shortUserData.avatar}.png`
            : undefined}
          name={shortUserData?.global_name || shortUserData?.username}
          size={24}
          circle={true}
        />
        <p class="truncate font-bold" translate="no">
          {shortUserData?.global_name || shortUserData?.username}
        </p>
      {:else}
        <p class="font-bold opacity-70 xxs:pr-4">Not logged in</p>
      {/if}
    </div>

    <button
      class="cursor-pointer p-4 xxs:hidden"
      onclick={() => (menuOpen = !menuOpen)}
      aria-label="{menuOpen ? 'Close' : 'Open'} menu"
    >
      {#if menuOpen}
        <span in:fade={{ duration: 100 }}>
          <X class="h-6 w-6 shrink-0" />
        </span>
      {:else}
        <span in:fade={{ duration: 100 }}>
          <Menu class="h-6 w-6 shrink-0" />
        </span>
      {/if}
    </button>

    {#if menuOpen}
      <div
        class="fixed inset-0 isolate mt-12 flex items-start justify-end overflow-hidden bg-black/60 p-4 backdrop-blur-lg"
        transition:fade={{ duration: 100 }}
      >
        <div class="absolute inset-0 -z-10" onclick={() => (menuOpen = false)} aria-hidden="true"></div>

        <div
          class="flex max-h-full w-fit flex-col overflow-hidden rounded-xl border-4 border-zinc-700 bg-zinc-800 p-4 shadow-2xl"
          transition:fly={{ duration: 300, y: prefersReducedMotion.current ? 0 : -10, opacity: 0 }}
        >
          <nav class="flex h-full w-full flex-col items-center justify-start gap-2">
            <a
              class="flex h-full w-full items-center justify-start gap-2 rounded-lg text-xl font-semibold"
              href={resolve('/')}
            >
              {#if userData}
                <Server size={30} class="shrink-0" />
                Servers
              {:else}
                <LogIn size={30} class="shrink-0" />
                Log in
              {/if}
            </a>
            <a
              class="flex h-full w-full items-center justify-start gap-2 rounded-lg text-xl font-semibold"
              href="https://titaniumbot.me/server"
              target="_blank"
            >
              <LifeBuoy size={30} class="shrink-0" />
              Support
            </a>
            {#if userData}
              <a
                class="flex h-full w-full items-center justify-start gap-2 rounded-lg text-xl font-semibold"
                href={resolve('/auth/logout')}
              >
                <LogOut size={30} class="shrink-0" />
                Logout
              </a>
            {/if}
          </nav>
        </div>
      </div>
    {/if}
    {#if userData}
      <a
        class="hidden h-full items-center justify-center gap-2 border-y-transparent border-b-zinc-500 px-4 text-xl font-semibold transition-all hover:border-y-4 xxs:flex"
        href={resolve('/auth/logout')}
      >
        <LogOut size={20} class="shrink-0" />
      </a>
    {/if}
  </div>
</header>
