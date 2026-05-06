<script lang="ts">
  import { X } from '@lucide/svelte';
  import type { CategoryInfo } from '$lib/interfaces/serverInfo';
  import ChannelContent from './ChannelContent.svelte';

  let {
    channel,
    categories = [],
    deleteThis = () => {}
  }: { channel?: string; categories?: CategoryInfo[]; deleteThis: () => void } = $props();
</script>

<div class="flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-700 bg-zinc-800 p-1 px-2 text-base">
  <button class="cursor-pointer" onclick={deleteThis} aria-label="Remove channel">
    <X size={16} />
  </button>

  <ChannelContent {channel} {categories} />
</div>
