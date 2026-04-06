<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import { getUserGuilds } from '$lib/remote/guilds.remote';

  import Row from '$lib/components/ui/row/Row.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import LogIn from '$lib/components/ui/discord/LogIn.svelte';
  import logo from '$lib/assets/logo.svg';

  import { RefreshCw, Plus, ChevronRight, Wrench, Rows2, LayoutGrid } from '@lucide/svelte';

  import verified from '$lib/assets/verified.svg';
  import partner from '$lib/assets/partner.svg';

  import type { ServerInfo } from '$lib/interfaces/serverInfo';
  import type { HttpError, RemoteQuery } from '@sveltejs/kit';

  let { data } = $props();
  let guildsQuery:
    | RemoteQuery<{
        nonMutualGuilds: ServerInfo[];
        mutualGuilds: ServerInfo[];
      }>
    | undefined = $state();

  let rowsView: boolean = $state(false);

  onMount(() => {
    guildsQuery = getUserGuilds();
  });
</script>

{#snippet guildRow(guild: ServerInfo, invite = false)}
  <a
    class="overflow-hidden rounded-md border border-zinc-700 transition-all"
    href={resolve(`/guild/${guild.id}`)}
    title={guild.name}
    data-sveltekit-preload-data={false}
    class:hover:bg-zinc-700={rowsView}
  >
    {#if guild.banner}
      <img
        src="https://cdn.discordapp.com/banners/{guild.id}/{guild.banner}.webp?size=512"
        alt="{guild.name} server banner"
        class="hidden h-25 w-full mask-b-from-70% object-cover"
        class:brightness-50={invite}
        class:xs:block={!rowsView}
      />
    {:else if guild.icon}
      <img
        src="https://cdn.discordapp.com/icons/{guild.id}/{guild.icon}.webp?size=512"
        alt="{guild.name} server banner"
        class="hidden h-25 w-full mask-b-from-70% object-cover opacity-50 blur-xl"
        class:brightness-50={invite}
        class:xs:block={!rowsView}
      />
    {:else}
      <span
        class="hidden h-25 w-full bg-zinc-700 mask-b-from-70%"
        class:brightness-50={invite}
        class:xs:block={!rowsView}
      ></span>
    {/if}

    <div
      class="relative flex items-center gap-4 p-4"
      class:xs:flex-col={!rowsView}
      class:xs:items-start={!rowsView}
      class:xs:gap-2={!rowsView}
      class:xs:pt-9={!rowsView}
    >
      <Avatar
        src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : undefined}
        name={guild.name}
        size={50}
        class="{rowsView ? '' : 'xs:absolute xs:-top-7'} {invite ? 'brightness-50' : ''}"
      />
      <div class="flex items-center gap-1" class:brightness-50={invite}>
        {#if guild.features?.includes('PARTNERED')}
          <img src={partner} alt="Partnered Server" class="h-5 w-5" translate="no" />
        {:else if guild.features?.includes('VERIFIED')}
          <img src={verified} alt="Verified Server" class="h-5 w-5" translate="no" />
        {/if}
        <p>{guild.name}</p>
      </div>

      <span
        class="hidden h-fit w-fit shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-zinc-700 px-2 py-1 text-sm font-semibold transition-colors hover:bg-zinc-600"
        class:xs:flex={!rowsView}
      >
        {#if invite}
          <Plus size={15} />
          Add Bot
        {:else}
          <Wrench size={15} />
          Manage Bot
        {/if}
      </span>

      {#if invite}
        <Plus class="ml-auto shrink-0 {rowsView ? '' : 'xs:hidden'}" />
      {:else}
        <ChevronRight class="ml-auto shrink-0 {rowsView ? '' : 'xs:hidden'}" />
      {/if}
    </div>
  </a>
{/snippet}

<div class="flex h-full flex-col items-center justify-center p-4">
  <Alert class="mb-4 bg-red-800/50">
    <p>You must have access to the Titanium v2 private beta to use this dashboard.</p>
  </Alert>

  <Row
    class="flex h-full {data.userData && !rowsView
      ? 'max-h-250 max-w-312'
      : 'max-h-156 max-w-lg'} w-full flex-col items-center gap-4 overflow-hidden p-4 transition-all duration-500"
  >
    <div class="flex w-full items-center justify-center gap-2">
      <img src={logo} alt="Titanium" class="h-12 w-12 rounded-md" translate="no" />
      <h1 class="text-2xl font-bold" translate="no">Titanium</h1>

      {#if data.userData}
        <button
          class="ml-auto cursor-pointer rounded-lg bg-zinc-700 p-2 transition-colors hover:bg-zinc-600"
          onclick={() => (rowsView = !rowsView)}
        >
          {#if rowsView}
            <LayoutGrid size={16} />
          {:else}
            <Rows2 size={16} />
          {/if}
        </button>
        <button
          class="cursor-pointer rounded-lg bg-zinc-700 p-2 transition-colors hover:bg-zinc-600"
          class:cursor-not-allowed={guildsQuery?.loading}
          class:opacity-50={guildsQuery?.loading}
          onclick={async () => await guildsQuery?.refresh()}
          disabled={guildsQuery?.loading}
        >
          <RefreshCw size={16} class={guildsQuery?.loading ? 'animate-spin' : ''} />
        </button>
      {/if}
    </div>

    <div class="flex w-full flex-1 flex-col gap-4 overflow-y-auto">
      {#if data.userData}
        <noscript>
          <Alert class="bg-yellow-800/50">
            <p>
              <strong>JavaScript is disabled in your browser.</strong> Please enable it to use all dashboard features.
            </p>
          </Alert>
        </noscript>

        {#if !guildsQuery || guildsQuery.loading}
          <div
            class="grid w-full gap-2 overflow-hidden"
            class:xs:grid-cols-2={!rowsView}
            class:md:grid-cols-3={!rowsView}
            class:xs:gap-4={!rowsView}
          >
            {#each Array.from({ length: 21 }, (_, i) => i) as i (i)}
              <div class="block h-20 w-full animate-pulse rounded-md bg-zinc-700" class:xs:h-40={!rowsView}></div>
            {/each}
          </div>
        {:else if guildsQuery.error}
          <Alert class="m-auto w-fit max-w-2xl bg-red-800/50">
            <p>
              Error loading your guilds: <strong>{(guildsQuery.error as HttpError).body.message}.</strong> Please try again
              in a few minutes.
            </p>
          </Alert>
        {:else if !guildsQuery.current || (guildsQuery.current?.nonMutualGuilds.length === 0 && guildsQuery.current?.mutualGuilds.length === 0)}
          <Alert class="m-auto w-fit max-w-2xl bg-yellow-800/50">
            <p>
              <strong>You don't have any guilds where you are an administrator.</strong> Once you are an administrator in
              a server or you get added to a server as a dashboard / role manager, it will appear in this list.
            </p>
          </Alert>
        {:else}
          {#if guildsQuery.current?.mutualGuilds.length > 0}
            <p class="text-base font-bold">
              Servers with Titanium ({guildsQuery.current?.mutualGuilds.length})
            </p>

            <div
              class="grid w-full gap-2"
              class:xs:grid-cols-2={!rowsView}
              class:md:grid-cols-3={!rowsView}
              class:xs:gap-4={!rowsView}
            >
              {#each guildsQuery.current?.mutualGuilds as guild (guild.id)}
                {@render guildRow(guild)}
              {/each}
            </div>
          {/if}

          {#if guildsQuery.current?.nonMutualGuilds.length > 0}
            <p class="mt-4 text-base font-bold">
              Servers without Titanium ({guildsQuery.current?.nonMutualGuilds.length})
            </p>

            <div
              class="grid w-full gap-2"
              class:xs:grid-cols-2={!rowsView}
              class:md:grid-cols-3={!rowsView}
              class:xs:gap-4={!rowsView}
            >
              {#each guildsQuery.current?.nonMutualGuilds as guild (guild.id)}
                {@render guildRow(guild, true)}
              {/each}
            </div>
          {/if}
        {/if}
      {:else}
        <LogIn class="m-auto" />
      {/if}
    </div>
  </Row>

  <p class="mt-4 font-semibold opacity-50">© 2026, Restart</p>
</div>
