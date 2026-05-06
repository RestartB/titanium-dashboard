<script lang="ts">
  import type { CategoryInfo } from '$lib/interfaces/serverInfo';
  import { CircleQuestionMark, Hash, Megaphone, MessagesSquare, Podcast, Volume2 } from '@lucide/svelte';
  import type { Component } from 'svelte';

  let {
    channel,
    categories = []
  }: {
    channel?: string | null;
    categories?: CategoryInfo[];
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
