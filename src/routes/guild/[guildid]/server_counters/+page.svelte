<script lang="ts">
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import Channel from '$lib/components/server_counters/Channel.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import LimitPill from '$lib/components/ui/LimitPill.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Assistant from '$lib/components/permissions/Assistant.svelte';
  import PermRow from '$lib/components/permissions/PermRow.svelte';
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
  <Assistant permissions={BigInt(data.serverInfo.bot_permissions)} allRequired={0x0000000000000010n}>
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={0x0000000000000010n}
      title="Manage Channels"
      description="Allows Titanium to create and update counter channels."
    />
  </Assistant>

  {#if data.serverInfo.member_count > 250}
    <Alert>
      <p>
        Your server is considered by Discord to be large (over 250 members). The "Users" and "Bots" counter types may
        take longer to update initially due to this.
      </p>
    </Alert>
  {/if}

  <div class="flex flex-col gap-4">
    <Button
      disabled={dataState.pageSettings.channels.length >= data.serverInfo.limits.server_counters &&
        data.serverInfo.limits.enforcing}
      onclick={() => {
        dataState.pageSettings.channels.push(createBlankChannel('total_members'));
      }}
    >
      <Plus size={20} />
      Add Channel
    </Button>

    {#if data.serverInfo.limits.enforcing}
      <LimitPill amount={dataState.pageSettings.channels.length} limit={data.serverInfo.limits.server_counters} />
    {/if}

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
