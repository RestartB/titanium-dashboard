<script lang="ts">
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import type { CategoryInfo } from '$lib/interfaces/serverInfo';
  import ChannelContent from './ChannelContent.svelte';

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
</script>

{#if overlayOpen}
  <ChannelPicker {categories} {onSelect} bind:selectedChannel={channel} bind:overlayOpen />
{/if}

<button
  class="flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-zinc-700 p-1 px-2 transition-colors hover:bg-zinc-600 {className}"
  onclick={() => (overlayOpen = !overlayOpen)}
  aria-label="Toggle channel selector"
>
  <ChannelContent {channel} {categories} />
</button>
