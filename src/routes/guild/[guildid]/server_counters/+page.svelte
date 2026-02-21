<script lang="ts">
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import Channel from '$lib/components/server_counters/Channel.svelte';
  import Saver from '$lib/components/Saver.svelte';

  import { Plus } from '@lucide/svelte';

  import type { ServerCounterChannelSchema } from '$lib/validators/serverCounters';

  let { data } = $props();
  let dataState = $state(data);

  function createBlankChannel(type: ServerCounterChannelSchema['type']): ServerCounterChannelSchema {
    return {
      id: '',
      name: '',
      type: type
    };
  }
</script>

<Saver page="server_counters" {data} bind:dataState />

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Server Counters</h2>
    <p>Display various server statistics and counters in your channel list.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.server_counters} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.server_counters}>
  <div class="flex flex-col gap-4">
    <Button
      onclick={() => {
        dataState.pageSettings.channels.push(createBlankChannel('total_members'));
      }}
    >
      <Plus size={20} />
      Add Channel
    </Button>
    {#each dataState.pageSettings.channels as _, index}
      <Channel
        {index}
        bind:channel={dataState.pageSettings.channels[index]}
        deleteThis={() => {
          dataState.pageSettings.channels.splice(index, 1);
        }}
      />
    {/each}
  </div>
</ToggledContent>
