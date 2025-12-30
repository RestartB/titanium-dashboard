<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

  import { Hash, Megaphone, MessagesSquare, Volume2, Podcast } from '@lucide/svelte';

  import Fuse from 'fuse.js';
  import type { ChannelInfo, CategoryInfo } from '$lib/interfaces/serverInfo';
  import type { Component } from 'svelte';

  let {
    categories,
    selectedChannel = $bindable(),
    overlayOpen = $bindable(false)
  }: {
    categories: CategoryInfo[];
    selectedChannel?: string | null;
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
    aria-label="Select {channel.name} channel"
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

<FullscreenOverlay bind:overlayOpen title="Select a Channel">
  <div class="flex h-fit w-full shrink-0 flex-col gap-2 border-b-2 border-zinc-600 p-2">
    <input
      type="text"
      placeholder="Search channels..."
      class="w-full rounded-md border-2 border-zinc-600 bg-zinc-800 p-2 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
      bind:value={searchInput}
    />
  </div>

  <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-2">
    {#each categories as category (category.id)}
      {@const categoryChannels = filteredChannels.filter((channel) => channel.category === category.id)}
      {#if categoryChannels.length > 0}
        <div class="flex flex-col gap-1">
          {#if category.id !== null}
            <h3 class="text-base font-semibold text-zinc-400">
              {category.name}
            </h3>
          {/if}
          {#each categoryChannels as channel (channel.id)}
            {@render channelRow(channel)}
          {/each}
        </div>
      {/if}
    {/each}
  </div>
</FullscreenOverlay>
