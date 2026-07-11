<script lang="ts">
  import { page } from '$app/state';

  import ChannelButton from '$lib/components/ui/discord/ChannelButton.svelte';
  import Collapsible from '$lib/components/ui/Collapsible.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import Assistant from '$lib/components/permissions/Assistant.svelte';
  import PermRow from '$lib/components/permissions/PermRow.svelte';
  import { ListPlus, ListX, X } from '@lucide/svelte';

  import type { LoggingEvent } from '$lib/interfaces/logging.js';

  let { data } = $props();
  let dataState = $state(data);

  let overlayOpen = $state(false);
  const categories = [...new Set(data.loggingEvents.map((event) => event.category))].sort();
</script>

{#snippet loggingEventRow(eventType: LoggingEvent)}
  <li
    class="flex w-full flex-col gap-1 rounded-lg bg-zinc-700 p-2 px-4 xs:flex-row xs:items-center xs:justify-between xs:gap-2"
  >
    <div>
      <p class="font-bold">{eventType.name}</p>
      <p class="text-base text-zinc-400">{eventType.description}</p>
    </div>

    <div class="flex shrink-0 flex-wrap items-center gap-2 overflow-auto">
      {#if dataState.pageSettings.channels[eventType.event]}
        <Button
          onclick={() => {
            delete dataState.pageSettings.channels[eventType.event];
          }}
          class="bg-zinc-800 p-2"
          border={false}
        >
          <X size={20} />
        </Button>
      {/if}

      <ChannelButton
        categories={data.serverInfo.categories}
        channel={dataState.pageSettings.channels[eventType.event]}
        onSelect={(channel) => {
          dataState.pageSettings.channels[eventType.event] = channel;
        }}
        class="bg-zinc-800"
      />
    </div>
  </li>
{/snippet}

<Saver page="logging" {data} bind:dataState />

{#if overlayOpen}
  <ChannelPicker
    categories={data.serverInfo.categories}
    onSelect={(channel) => {
      dataState.pageSettings.channels = {};
      for (const event of dataState.loggingEvents) {
        dataState.pageSettings.channels[event.event] = channel;
      }
    }}
    bind:overlayOpen
  />
{/if}

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Logging</h2>
    <p>Set log channels for various events that happen in your server.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.logging} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.logging}>
  <Assistant
    permissions={BigInt(data.serverInfo.bot_permissions)}
    allRequired={0x0000000020000000n | 0x0000000000000080n | 0x0000000000000020n | 0x0000000000000010n}
  >
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={0x0000000020000000n}
      title="Manage Webhooks"
      description="Allows Titanium to create logging webhooks."
    />
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={0x0000000000000080n}
      title="View Audit Log"
      description="Allows Titanium to get events from the audit log."
    />
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={0x0000000000000020n}
      title="Manage Server"
      description="Allows Titanium to see when Discord automod rules are updated."
    />
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={0x0000000000000010n}
      title="Manage Channels"
      description="Allows Titanium to see when invites are created and deleted."
    />
  </Assistant>

  <div class="flex items-center gap-2">
    <Button
      onclick={() => {
        overlayOpen = true;
      }}
    >
      <ListPlus size={20} />
      Set All Channels
    </Button>

    <Button onclick={() => (dataState.pageSettings.channels = {})}>
      <ListX size={20} />
      Clear All
    </Button>
  </div>

  <Collapsible title="Titanium" defaultState={page.url.hash === '#titanium' ? true : false}>
    <ul class="flex flex-col gap-2">
      {#each data.loggingEvents.filter((event) => event.category === 'Titanium') as event (event.event)}
        {@render loggingEventRow(event)}
      {/each}
    </ul>
  </Collapsible>

  <hr class="border-zinc-500 last:hidden" />

  {#each categories.filter((category) => category !== 'Titanium') as category (category)}
    <Collapsible title={category}>
      <ul class="flex flex-col gap-2">
        {#each data.loggingEvents.filter((event) => event.category === category) as event (event.event)}
          {@render loggingEventRow(event)}
        {/each}
      </ul>
    </Collapsible>

    <hr class="border-zinc-500 last:hidden" />
  {/each}
</ToggledContent>
