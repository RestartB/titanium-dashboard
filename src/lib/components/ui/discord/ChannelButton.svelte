<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import { Hash, Megaphone, MessagesSquare, Volume2, Podcast } from '@lucide/svelte';
  import type { Component } from 'svelte';
  import type { CategoryInfo } from '$lib/interfaces/serverInfo';

  let overlayOpen = $state(false);

  let {
    categories = [],
    channel = $bindable(),
    class: className = ''
  }: {
    categories?: CategoryInfo[];
    channel?: string;
    class?: string;
  } = $props();
  const channelTypeIcons: Record<string, Component> = {
    text: Hash,
    news: Megaphone,
    forum: MessagesSquare,
    voice: Volume2,
    stage_voice: Podcast
  };

  let allChannels = $derived(
    categories
      .flatMap((category) => category.channels)
      .concat(categories.filter((c) => c.id === null).flatMap((c) => c.channels))
  );
  const selectedChannel = $derived.by(() => {
    return allChannels.find((c) => c.id === channel);
  });
</script>

{#if overlayOpen}
  <FullscreenOverlay bind:overlayOpen>
    <ChannelPicker {categories} bind:selectedChannel={channel} bind:overlayOpen />
  </FullscreenOverlay>
{/if}

{#snippet channelContent()}
  {#if selectedChannel}
    {#if channelTypeIcons[selectedChannel.type]}
      {@const Icon = channelTypeIcons[selectedChannel.type]}
      <Icon class="h-4 w-4 text-zinc-400" />
    {:else}
      <Hash class="h-4 w-4 text-zinc-400" />
    {/if}
    <p class="text-zinc-200 select-none">{selectedChannel.name}</p>
  {:else}
    <p class="text-zinc-500 select-none">No channel set</p>
  {/if}
{/snippet}

<button
  class="flex w-fit flex-shrink-0 cursor-pointer items-center gap-2 rounded-lg p-1 px-2 transition-colors hover:bg-zinc-600 {className}"
  onclick={() => (overlayOpen = !overlayOpen)}
  aria-label="Toggle channel selector"
>
  {@render channelContent()}
</button>
