<script lang="ts">
  import { X, Hash, Megaphone, MessagesSquare, Volume2, Podcast } from '@lucide/svelte';

  import Fuse from 'fuse.js';
  import type { ChannelInfo, CategoryInfo } from '$lib/types/serverInfo';
  import type { Component } from 'svelte';

  let {
    categories,
    selectedChannel = $bindable(),
    overlayOpen = $bindable(false)
  }: {
    categories: CategoryInfo[];
    selectedChannel?: string;
    overlayOpen?: boolean;
  } = $props();

  const channelTypeIcons: Record<string, Component> = {
    text: Hash,
    news: Megaphone,
    forum: MessagesSquare,
    voice: Volume2,
    stage_voice: Podcast
  };

  let searchInput = $state('');
  let allChannels = $derived(categories.flatMap((category) => category.channels));

  const fuse = $derived(
    new Fuse(allChannels, {
      keys: ['name', 'id'],
      threshold: 0.3
    })
  );

  function getFilteredChannels(query: string): ChannelInfo[] {
    if (!query) return allChannels;

    const lowercasedQuery = query.toLowerCase();
    return fuse.search(lowercasedQuery).map((result) => result.item);
  }

  let filteredChannels = $derived(getFilteredChannels(searchInput));
</script>

{#snippet channelRow(channel: ChannelInfo)}
  <button
    class="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-zinc-800 p-1 px-2 hover:bg-zinc-600"
    onclick={() => {
      selectedChannel = channel.id;
      overlayOpen = false;
    }}
  >
    {#if channelTypeIcons[channel.type]}
      {@const Icon = channelTypeIcons[channel.type]}
      <Icon class="h-4 w-4 text-zinc-400" />
    {:else}
      <Hash class="h-4 w-4 text-zinc-400" />
    {/if}
    <p class="text-zinc-200 select-none">{channel.name}</p>
  </button>
{/snippet}

<div
  class="flex w-full max-w-104 flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
>
  <div class="items-between flex w-full justify-center gap-2">
    <h2 class="text-xl font-bold">Select a Channel</h2>
    <button
      class="ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
      onclick={() => (overlayOpen = false)}
      aria-label="Close channel selector"
    >
      <X class="h-6 w-6" />
    </button>
  </div>
  <div
    class="flex h-full max-h-[30rem] min-h-[30rem] w-full max-w-96 flex-shrink-0 flex-col rounded-xl border-2 border-zinc-600 bg-zinc-700"
  >
    <div class="flex h-fit w-full flex-shrink-0 flex-col gap-2 border-b-2 border-zinc-600 p-2">
      <input
        type="text"
        placeholder="Search channels..."
        class="w-full rounded-md border-2 border-zinc-600 bg-zinc-800 p-2 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
        bind:value={searchInput}
      />
    </div>

    <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-2">
      {#each categories as category}
        {@const categoryChannels = filteredChannels.filter(
          (channel) => channel.category === category.id
        )}
        {#if categoryChannels.length > 0}
          <div class="flex flex-col gap-1">
            {#if category.id !== null}
              <h3 class="text-base font-semibold text-zinc-400">
                {category.name}
              </h3>
            {/if}
            {#each categoryChannels as channel}
              {@render channelRow(channel)}
            {/each}
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>
