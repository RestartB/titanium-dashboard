<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import logo from '$lib/assets/logo.svg';
  import discord from '$lib/assets/discord.svg';

  import verified from '$lib/assets/verified.png';
  import partner from '$lib/assets/partner.webp';

  let { data } = $props();
</script>

{#snippet guildRow(guild: any, invite = false)}
  <a
    class="flex w-full items-center gap-4 rounded-md border border-zinc-700 p-4 transition-all"
    class:cursor-default={invite}
    class:hover:bg-zinc-700={!invite}
    href={`/guild/${guild.id}`}
    title={guild.name}
    data-sveltekit-preload-data={false}
  >
    <Avatar
      src={guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
        : undefined}
      name={guild.name}
      size={40}
      class={invite ? 'opacity-50' : ''}
    />
    <div class="flex items-center gap-1" class:opacity-50={invite}>
      {#if guild.features.includes('PARTNERED')}
        <img src={partner} alt="Partnered Server" class="h-4 w-4" translate="no" />
      {:else if guild.features.includes('VERIFIED')}
        <img src={verified} alt="Verified Server" class="h-4 w-4" translate="no" />
      {/if}
      <p>{guild.name}</p>
    </div>

    {#if invite}
      <span
        class="ml-auto flex-shrink-0 cursor-pointer rounded-md bg-zinc-700 px-2 py-1 text-sm font-semibold transition-colors hover:bg-zinc-600"
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
  <Row
    class="flex h-auto max-h-156 w-full max-w-128 flex-col items-center gap-4 overflow-hidden p-4"
  >
    <div class="flex items-center justify-center gap-2">
      <img src={logo} alt="Titanium" class="h-12 w-12 rounded-md" translate="no" />
      <h1 class="text-2xl font-bold" translate="no">Titanium Dashboard</h1>
    </div>
    <div class="flex w-full flex-1 flex-col gap-2 overflow-y-auto">
      {#if data.userData}
        {#if !data.guildsData || !data.guildsData.mutualGuilds || !data.guildsData.nonMutualGuilds}
          <p class="text-center text-zinc-300/60">
            An error occurred while loading servers. Try again later.
          </p>
        {:else if data.guildsData.mutualGuilds.length === 0 && data.guildsData.nonMutualGuilds.length === 0}
          <p class="text-center text-zinc-300/60">
            You do not have permission to control or add Titanium to any servers.
          </p>
        {:else}
          {#if data.guildsData.mutualGuilds.length > 0}
            <p class="text-base font-bold text-zinc-300/60">
              Servers with Titanium <span class="text-zinc-400"
                >({data.guildsData.mutualGuilds.length})</span
              >
            </p>
          {/if}
          {#each data.guildsData.mutualGuilds as guild}
            {@render guildRow(guild)}
          {/each}
          {#if data.guildsData.nonMutualGuilds.length > 0}
            <p class="mt-2 text-base font-bold text-zinc-300/60">
              Servers without Titanium <span class="text-zinc-400"
                >({data.guildsData.nonMutualGuilds.length})</span
              >
            </p>
          {/if}
          {#each data.guildsData.nonMutualGuilds as guild}
            {@render guildRow(guild, true)}
          {/each}
        {/if}
      {:else}
        <a
          class="flex items-center justify-center gap-2 rounded-md bg-blurple p-2 px-4 text-white transition-all hover:brightness-150"
          href="/auth/login"
        >
          <img src={discord} alt="Discord" class="h-6 w-6" />
          Log in with Discord</a
        >
      {/if}
    </div>
  </Row>
  <p class="mt-4 font-semibold opacity-80">© 2025, Restart</p>
</div>
