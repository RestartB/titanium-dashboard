<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import TypePicker from './TypePicker.svelte';
  import { Trash, Cog } from '@lucide/svelte';

  import { typeDisplayNames } from '$lib/strings/server_counters';
  import type { ServerCounterChannelSchema } from '$lib/validators/serverCounters';

  let {
    index,
    channel = $bindable(),
    deleteThis
  }: {
    index: number;
    channel: ServerCounterChannelSchema;
    deleteThis: () => void;
  } = $props();

  let typePickerOpen = $state(false);
</script>

{#if typePickerOpen}
  <FullscreenOverlay bind:overlayOpen={typePickerOpen}>
    <TypePicker bind:channel bind:overlayOpen={typePickerOpen} />
  </FullscreenOverlay>
{/if}

<Row class="flex flex-col gap-2">
  <div class="flex items-center justify-between gap-2">
    <button
      class="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-700 p-1 px-2 transition-colors hover:bg-zinc-600"
      aria-label="Open type picker"
      onclick={() => {
        typePickerOpen = true;
      }}
    >
      <Cog size={16} />
      {typeDisplayNames[channel.type] || 'Select Type'}
    </button>

    <button
      class="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-red-600 bg-red-700 p-2 text-base transition-colors hover:bg-red-600 xs:p-1"
      onclick={deleteThis}
      aria-label="Delete channel counter"
    >
      <Trash size={16} class="shrink-0" />
      <p class="hidden xs:block">Delete</p>
    </button>
  </div>

  <div>
    <label for="channel-name-{index}" class="font-bold">Channel Name</label>
    <p>The name of the channel. You can use &#123;value&#125; to insert the counter value.</p>
  </div>
  <input
    id="channel-name-{index}"
    type="text"
    bind:value={channel.name}
    placeholder="e.g. Members: &#123;value&#125;"
    class="w-full rounded-lg border-2 border-zinc-700 bg-zinc-800 p-2 transition-colors outline-none focus:border-zinc-500"
  />
  <p class="text-base text-zinc-400">Preview: {channel.name.replace('{value}', '1234')}</p>

  {#if channel.type === 'activity'}
    <div>
      <label for="activity-name-{index}" class="font-bold">Activity Name</label>
      <p>The name of the activity that Titanium will watch for.</p>
    </div>
    <input
      id="activity-name-{index}"
      type="text"
      bind:value={channel.activity_name}
      placeholder="e.g. Fortnite, Visual Studio Code"
      class="w-full rounded-lg border-2 border-zinc-700 bg-zinc-800 p-2 transition-colors outline-none focus:border-zinc-500"
    />
  {/if}
</Row>
