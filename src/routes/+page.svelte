<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import { getUserGuilds } from '$lib/remote/guilds.remote';

  import Row from '$lib/components/ui/row/Row.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import LogIn from '$lib/components/ui/discord/LogIn.svelte';
  import logo from '$lib/assets/logo.svg';

  import { LoaderCircle, RefreshCw } from '@lucide/svelte';

  import verified from '$lib/assets/verified.png';
  import partner from '$lib/assets/partner.webp';

  import type { ServerInfo } from '$lib/interfaces/serverInfo';
  import type { RemoteQuery } from '@sveltejs/kit';

  let { data } = $props();
  let guildsQuery:
    | RemoteQuery<{
        nonMutualGuilds: any;
        mutualGuilds: any;
      }>
    | undefined = $state();

  onMount(() => {
    guildsQuery = getUserGuilds();
  });
</script>

{#snippet guildRow(guild: ServerInfo, invite = false)}
  <a
    class="flex w-full items-center gap-4 rounded-md border border-zinc-700 p-4 transition-all"
    class:cursor-default={invite}
    class:hover:bg-zinc-700={!invite}
    href={resolve(`/guild/${guild.id}`)}
    title={guild.name}
    data-sveltekit-preload-data={false}
  >
    <Avatar
      src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : undefined}
      name={guild.name}
      size={40}
      class={invite ? 'opacity-50' : ''}
    />
    <div class="flex items-center gap-1" class:opacity-50={invite}>
      {#if guild.features?.includes('PARTNERED')}
        <img src={partner} alt="Partnered Server" class="h-4 w-4" translate="no" />
      {:else if guild.features?.includes('VERIFIED')}
        <img src={verified} alt="Verified Server" class="h-4 w-4" translate="no" />
      {/if}
      <p>{guild.name}</p>
    </div>

    {#if invite}
      <span
        class="ml-auto shrink-0 cursor-pointer rounded-md bg-zinc-700 px-2 py-1 text-sm font-semibold transition-colors hover:bg-zinc-600"
      >
        Add Bot
      </span>
    {/if}
  </a>
{/snippet}

<div class="relative flex h-full flex-col items-center justify-center p-4">
  <div
    class="absolute right-0 left-0 -z-50 h-full w-full bg-[url('/images/background_blur.svg')] bg-cover bg-center bg-no-repeat brightness-50"
  ></div>

  <Alert class="mb-4 bg-red-800/50">
    <p>You must have access to the Titanium v2 private beta to use this dashboard.</p>
  </Alert>

  <Row class="flex h-full max-h-156 w-full max-w-lg flex-col items-center gap-4 overflow-hidden p-4">
    <div class="flex w-full items-center justify-center gap-2">
      <img src={logo} alt="Titanium" class="h-12 w-12 rounded-md" translate="no" />
      <h1 class="text-2xl font-bold" translate="no">Titanium</h1>

      {#if data.userData}
        <button
          class="ml-auto cursor-pointer rounded-lg bg-zinc-700 p-2 transition-colors hover:bg-zinc-600"
          class:cursor-not-allowed={guildsQuery?.loading}
          class:opacity-50={guildsQuery?.loading}
          onclick={async () => await guildsQuery?.refresh()}
          disabled={guildsQuery?.loading}
        >
          <RefreshCw size={16} class={guildsQuery?.loading ? 'animate-spin' : ''} />
        </button>
      {/if}
    </div>

    <div class="flex w-full flex-1 flex-col gap-2 overflow-y-auto">
      {#if data.userData}
        <noscript>
          <Alert class="bg-yellow-800/50">
            <p><strong>JavaScript is disabled in your browser.</strong> Please enable it to use the dashboard.</p>
          </Alert>
        </noscript>
        {#if !guildsQuery || guildsQuery.loading}
          <div class="my-auto flex items-center justify-center gap-2">
            <LoaderCircle size={28} class="animate-spin" />
            <p class="text-xl font-semibold">Loading...</p>
          </div>
        {:else if guildsQuery.error}
          <Alert class="bg-red-800/50">
            <p>Error loading your guilds: {guildsQuery.error}</p>
          </Alert>
        {:else if guildsQuery.current?.nonMutualGuilds.length === 0 && guildsQuery.current?.mutualGuilds.length === 0}
          <Alert class="bg-yellow-800/50">
            <p>You don't have any guilds where you are an administrator.</p>
          </Alert>
        {:else}
          {#if guildsQuery.current?.mutualGuilds.length > 0}
            <p class="text-base font-bold text-zinc-300/60">
              Servers with Titanium <span class="text-zinc-400">({guildsQuery.current?.mutualGuilds.length})</span>
            </p>

            {#each guildsQuery.current?.mutualGuilds as guild (guild.id)}
              {@render guildRow(guild)}
            {/each}
          {/if}

          {#if guildsQuery.current?.nonMutualGuilds.length > 0}
            <p class="text-base font-bold text-zinc-300/60">
              Servers without Titanium <span class="text-zinc-400">({guildsQuery.current?.nonMutualGuilds.length})</span
              >
            </p>

            {#each guildsQuery.current?.nonMutualGuilds as guild (guild.id)}
              {@render guildRow(guild, true)}
            {/each}
          {/if}
        {/if}
      {:else}
        <LogIn class="m-auto" />
      {/if}
    </div>
  </Row>

  <p class="mt-4 font-semibold opacity-80">© 2026, Restart</p>
</div>
