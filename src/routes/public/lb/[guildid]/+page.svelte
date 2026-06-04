<script lang="ts">
  import { page } from '$app/state';
  import { getLeaderboard } from '$lib/remote/lb.remote';

  import Row from '$lib/components/ui/row/Row.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import LogIn from '$lib/components/ui/discord/LogIn.svelte';
  import logo from '$lib/assets/logo.png';
  import { LoaderCircle, Trophy, X } from '@lucide/svelte';
  import { onMount } from 'svelte';

  const { data } = $props();

  let currentPage = $state(1);
  let leaderboardFunction = $derived(
    data.serverInfo && data.enabled && !data.loginRequired && !data.noAccess
      ? getLeaderboard({ guildId: data.serverInfo.id, limit: 100, offset: 100 * currentPage - 100 })
      : null
  );

  let historicalSetting: 'Last 3 days' | 'Last 7 days' | 'Last 14 days' | 'Last 30 days' = $state('Last 7 days');
  let historicalAmount = $derived.by(() => {
    if (historicalSetting === 'Last 3 days') {
      return 2;
    } else if (historicalSetting === 'Last 7 days') {
      return 6;
    } else if (historicalSetting === 'Last 14 days') {
      return 13;
    } else {
      return 29;
    }
  });

  function changePage(page: number) {
    currentPage = page;
  }

  // https://stackoverflow.com/a/13627586
  function ordinal_suffix_of(i: number) {
    let j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + 'st';
    }
    if (j === 2 && k !== 12) {
      return i + 'nd';
    }
    if (j === 3 && k !== 13) {
      return i + 'rd';
    }
    return i + 'th';
  }

  onMount(() => {
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${
      data.serverInfo?.splash
        ? data.serverInfo.splash
        : data.serverInfo?.banner
          ? data.serverInfo.banner
          : '/images/background_blur.svg'
    }')`;
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
  });
</script>

<svelte:head>
  {#if data.enabled && data.serverInfo}
    <meta content={data.serverInfo.name} property="og:title" />
    <meta content="Titanium Leaderboard" property="og:site_name" />
    <meta content="View the Titanium Leaderboard for {data.serverInfo.name}." property="description" />
    <meta content="View the Titanium Leaderboard for {data.serverInfo.name}." property="og:description" />
    <meta content={page.url.href} property="og:url" />
    <meta content={data.serverInfo.icon || 'https://titanium.fyi/assets/logo.png'} property="og:image" />
  {/if}
</svelte:head>

{#snippet lbRow(
  username: string | null,
  display: string | null,
  pfp: string | null,
  id: string,
  position: string,
  xp: string,
  level: number,
  change: number[]
)}
  <div class="flex w-full items-center gap-2" {id}>
    <p class="min-w-14 truncate text-center font-bold">{position}</p>
    <img src={pfp || logo} alt="Logo" class="mr-2 h-10 w-10 shrink-0 rounded-full" />
    <div class="min-w-0 flex-1">
      {#if username}
        <p class="truncate text-sm font-light">@{username}</p>
        <p class="truncate">{display}</p>
      {:else}
        <p class="truncate">{id}</p>
      {/if}
    </div>

    <p class="ml-auto hidden max-w-14 min-w-14 text-center font-bold xs:block">
      {change.length > historicalAmount ? change[historicalAmount] : '---'}
    </p>

    <p class="max-w-14 min-w-14 text-center font-bold">{xp}</p>
    <p class="hidden max-w-14 min-w-14 text-center font-bold min-[432px]:block">
      {level}
    </p>
  </div>
{/snippet}

{#if !data.enabled}
  <div class="flex h-full flex-col items-center justify-center p-4">
    <Row
      class="flex w-full max-w-lg flex-col items-center gap-4 overflow-hidden bg-zinc-800 p-4 transition-all duration-500"
    >
      <div class="flex w-full items-center justify-center gap-2">
        <img src={logo} alt="Titanium" class="h-12 w-12 rounded-md" translate="no" />
        <h1 class="text-2xl font-bold" translate="no">Titanium</h1>
      </div>

      <div class="flex w-full flex-1 flex-col items-center justify-center gap-4 overflow-y-auto text-center">
        <p class="font-bold">The web leaderboard in this server is disabled.</p>
      </div>
    </Row>

    <p class="mt-4 font-semibold opacity-50">© 2026, Restart</p>
  </div>
{:else if data.loginRequired}
  <div class="flex h-full flex-col items-center justify-center p-4">
    <Row
      class="flex w-full max-w-lg flex-col items-center gap-4 overflow-hidden bg-zinc-800 p-4 transition-all duration-500"
    >
      <div class="flex w-full items-center justify-center gap-2">
        <img src={logo} alt="Titanium" class="h-12 w-12 rounded-md" translate="no" />
        <h1 class="text-2xl font-bold" translate="no">Titanium</h1>
      </div>

      <div class="flex w-full flex-1 flex-col items-center justify-center gap-4 overflow-y-auto text-center">
        <p class="font-bold">To access the leaderboard for this server, please log in.</p>
        <LogIn />
      </div>
    </Row>

    <p class="mt-4 font-semibold opacity-50">© 2026, Restart</p>
  </div>
{:else if data.noAccess}
  <div class="flex h-full flex-col items-center justify-center p-4">
    <Row
      class="flex w-full max-w-lg flex-col items-center gap-4 overflow-hidden bg-zinc-800 p-4 transition-all duration-500"
    >
      <div class="flex w-full items-center justify-center gap-2">
        <img src={logo} alt="Titanium" class="h-12 w-12 rounded-md" translate="no" />
        <h1 class="text-2xl font-bold" translate="no">Titanium</h1>
      </div>

      <div class="flex w-full flex-1 flex-col items-center justify-center gap-4 overflow-y-auto text-center">
        <p class="font-bold">Your account does not have access to this leaderboard.</p>
      </div>
    </Row>

    <p class="mt-4 font-semibold opacity-50">© 2026, Restart</p>
  </div>
{:else if data.serverInfo && leaderboardFunction !== null}
  <svelte:boundary>
    {#snippet pending()}
      <div class="m-4 mx-auto flex w-fit items-center gap-2 px-4 font-bold">
        <LoaderCircle size={20} class="shrink-0 animate-spin" />
        Loading...
      </div>
    {/snippet}

    {#snippet failed()}
      <div class="m-4 mx-auto flex w-fit items-center gap-4 px-4 font-bold">
        <X size={20} class="shrink-0" />
        An error occurred. Please reload the page and try again.
      </div>
    {/snippet}

    <div class="flex h-full flex-col items-center gap-4 overflow-y-auto p-4">
      <span class="flex items-center justify-center gap-2">
        <Trophy class="shrink-0" />
        <h1 class="text-center text-2xl font-semibold">Server Leaderboard</h1>
      </span>

      <span class="flex items-center gap-2 px-6">
        <Avatar src={data.serverInfo.icon || ''} name={data.serverInfo.name} size={40} />
        <p class="truncate text-center">{data.serverInfo.name}</p>
      </span>

      <div class="my-4 hidden w-full items-center justify-center gap-4 sm:flex">
        {#if currentPage === 1}
          {#if (await leaderboardFunction).leaderboard.length >= 2}
            <div class="h-fit max-w-3xs min-w-0 flex-1 text-center">
              <h3 class="mb-2 text-3xl font-semibold">2nd</h3>
              <img
                src={(await leaderboardFunction).leaderboard[1].user_pfp || logo}
                alt="User PFP"
                class="mx-auto max-h-30 min-h-30 max-w-30 min-w-30 shrink-0 rounded-full border-4 border-zinc-400 shadow-[0_0_30px_rgba(192,192,192,1)]"
              />
              <p class="mt-2 truncate text-xl font-semibold">
                @{(await leaderboardFunction).leaderboard[1].user_name ||
                  (await leaderboardFunction).leaderboard[1].user_id}
              </p>
              <p class="text-zinc-400">
                {(await leaderboardFunction).leaderboard[1].xp}xp - level {(await leaderboardFunction).leaderboard[1]
                  .level}
              </p>
            </div>
          {/if}

          {#if (await leaderboardFunction).leaderboard.length >= 1}
            <div class="h-fit max-w-3xs min-w-0 flex-1 text-center">
              <h3 class="mb-2 text-5xl font-bold">1st</h3>
              <img
                src={(await leaderboardFunction).leaderboard[0].user_pfp || logo}
                alt="User PFP"
                class="mx-auto max-h-40 min-h-40 max-w-40 min-w-40 shrink-0 rounded-full border-4 border-zinc-400 shadow-[0_0_50px_rgba(255,215,0,1)]"
              />
              <p class="mt-2 truncate text-xl font-semibold">
                @{(await leaderboardFunction).leaderboard[0].user_name ||
                  (await leaderboardFunction).leaderboard[0].user_id}
              </p>
              <p class="text-zinc-400">
                {(await leaderboardFunction).leaderboard[0].xp}xp - level {(await leaderboardFunction).leaderboard[0]
                  .level}
              </p>
            </div>
          {/if}

          {#if (await leaderboardFunction).leaderboard.length >= 3}
            <div class="h-fit max-w-3xs min-w-0 flex-1 text-center">
              <h3 class="mb-2 text-3xl font-semibold">3rd</h3>
              <img
                src={(await leaderboardFunction).leaderboard[2].user_pfp || logo}
                alt="User PFP"
                class="mx-auto max-h-30 min-h-30 max-w-30 min-w-30 shrink-0 rounded-full border-4 border-zinc-400 shadow-[0_0_30px_rgba(205,127,50,1)]"
              />
              <p class="mt-2 truncate text-xl font-semibold">
                @{(await leaderboardFunction).leaderboard[2].user_name ||
                  (await leaderboardFunction).leaderboard[2].user_id}
              </p>
              <p class="text-zinc-400">
                {(await leaderboardFunction).leaderboard[2].xp}xp - level {(await leaderboardFunction).leaderboard[2]
                  .level}
              </p>
            </div>
          {/if}
        {/if}
      </div>

      <Row class="w-full max-w-3xl space-y-2">
        <div class="flex items-center justify-end gap-2">
          <p class="hidden max-w-14 min-w-14 overflow-hidden text-center text-base text-ellipsis xs:block">+ -</p>
          <p class="max-w-14 min-w-14 overflow-hidden text-center text-base text-ellipsis">XP</p>
          <p class="hidden max-w-14 min-w-14 overflow-hidden text-center text-base text-ellipsis min-[432px]:block">
            Level
          </p>
        </div>

        {#each (await leaderboardFunction).leaderboard as entry, i (entry.user_id)}
          {@render lbRow(
            entry.user_name,
            entry.user_display,
            entry.user_pfp,
            entry.user_id,
            ordinal_suffix_of(i + 1 * currentPage),
            entry.xp,
            entry.level,
            entry.historical
          )}
        {/each}
      </Row>

      <div class="flex items-center justify-center w-full max-w-3xl gap-2 flex-col sm:flex-row">
        <Pagination
          {changePage}
          pageCount={Math.max(1, Math.ceil((await leaderboardFunction).total_count / 1))}
          disabled={$effect.pending() ? true : false}
          class="w-fit!"
          bind:currentPage
        />

        <div class="hidden xs:flex flex-col gap-1 sm:items-end items-center justify-center sm:ml-auto">
          <label for="difference" class="text-zinc-400 text-right block">Show position difference between</label>
          <select
            class="rounded-lg border-2 border-zinc-700 bg-zinc-800 p-1"
            id="difference"
            bind:value={historicalSetting}
          >
            <option>Last 3 days</option>
            <option>Last 7 days</option>
            <option>Last 14 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </div>
    </div>
  </svelte:boundary>
{/if}
