<script lang="ts">
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import { Hash, Megaphone, MessagesSquare, Volume2, Podcast, CircleQuestionMark } from '@lucide/svelte';
  import type { Component } from 'svelte';
  import type { CategoryInfo } from '$lib/interfaces/serverInfo';

  let overlayOpen = $state(false);

  let {
    categories = [],
    channel = $bindable(),
    onSelect = () => {},
    class: className = ''
  }: {
    categories?: CategoryInfo[];
    channel?: string | null;
    onSelect?: (channel: string) => void;
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

  const channelInfo = $derived.by(() => {
    return allChannels.find((c) => c.id === channel);
  });
</script>

{#if overlayOpen}
  <ChannelPicker {categories} {onSelect} bind:selectedChannel={channel} bind:overlayOpen />
{/if}

{#snippet channelContent()}
  {#if channel && channelInfo}
    {#if channelTypeIcons[channelInfo.type]}
      {@const Icon = channelTypeIcons[channelInfo.type]}
      <Icon class="h-4 w-4 text-zinc-400" />
    {:else}
      <Hash class="h-4 w-4 text-zinc-400" />
    {/if}
    <p class="text-left text-zinc-200 select-none">{channelInfo.name}</p>
  {:else if channel}
    <CircleQuestionMark class="h-4 w-4 text-zinc-400" />
    <p class="text-left text-zinc-200 select-none">{channel}</p>
  {:else}
    <p class="text-left text-zinc-500 select-none">No channel set</p>
  {/if}
{/snippet}

<button
  class="flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-zinc-700 p-1 px-2 transition-colors hover:bg-zinc-600 {className}"
  onclick={() => (overlayOpen = !overlayOpen)}
  aria-label="Toggle channel selector"
>
  {@render channelContent()}
</button>
