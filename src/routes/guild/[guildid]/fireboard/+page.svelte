<script lang="ts">
  import { flip } from 'svelte/animate';

  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import Board from '$lib/components/fireboard/Board.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import LimitPill from '$lib/components/ui/LimitPill.svelte';
  import Row from '$lib/components/ui/row/Row.svelte';
  import ChannelTile from '$lib/components/ui/discord/ChannelTile.svelte';
  import RoleTile from '$lib/components/ui/discord/RoleTile.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import { Plus } from '@lucide/svelte';

  import type { FireboardBoardSchema } from '$lib/validators/fireboard';

  let { data } = $props();
  let dataState = $state(data);

  let channelOverlayOpen = $state(false);
  let roleOverlayOpen = $state(false);

  function createBlankBoard(): FireboardBoardSchema {
    return {
      id: crypto.randomUUID(),
      channel_id: '',
      reaction: '🔥',
      threshold: 5,
      ignore_bots: true,
      ignore_self_reactions: true,
      send_notifications: true,
      ignored_channels: [],
      ignored_roles: []
    };
  }
</script>

<Saver page="fireboard" {data} bind:dataState />

{#if channelOverlayOpen}
  <ChannelPicker
    multiselect={true}
    categories={data.serverInfo.categories}
    bind:selectedChannels={dataState.pageSettings.global_ignored_channels}
    bind:overlayOpen={channelOverlayOpen}
  />
{/if}

{#if roleOverlayOpen}
  <RolePicker
    multiselect={true}
    roles={data.serverInfo.roles}
    bind:selectedRoles={dataState.pageSettings.global_ignored_roles}
    bind:overlayOpen={roleOverlayOpen}
  />
{/if}

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Fireboard</h2>
    <p>Let server members highlight messages they love.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.fireboard} />
</div>

<hr class="border-zinc-500" />
<p class="text-base font-bold text-zinc-300/60">Global Ignored Roles & Channels</p>

<Row>
  <h2 class="text-xl font-bold">Global Blocked Channels</h2>
  <p class="mb-2">Select up to 100 channels that all fireboards will ignore.</p>

  <div class="flex flex-wrap gap-2">
    <Button smallPadding={true} onclick={() => (channelOverlayOpen = true)}><Plus size={20} /> Add Channels</Button>
    {#each dataState.pageSettings.global_ignored_channels as channel (channel)}
      <ChannelTile
        {channel}
        categories={data.serverInfo.categories}
        deleteThis={() => {
          dataState.pageSettings.global_ignored_channels = dataState.pageSettings.global_ignored_channels.filter(
            (c) => c !== channel
          );
        }}
      />
    {/each}
  </div>
</Row>

<Row>
  <h2 class="text-xl font-bold">Global Blocked Roles</h2>
  <p class="mb-2">Select up to 100 roles that cannot be posted on any fireboard.</p>

  <div class="flex flex-wrap gap-2">
    <Button smallPadding={true} onclick={() => (roleOverlayOpen = true)}><Plus size={20} /> Add Roles</Button>
    {#each dataState.pageSettings.global_ignored_roles as role (role)}
      {@const foundRole = dataState.serverInfo.roles.find((r) => r.id === role)}
      {#if foundRole}
        <RoleTile
          role={foundRole}
          deleteThis={() => {
            dataState.pageSettings.global_ignored_roles = dataState.pageSettings.global_ignored_roles.filter(
              (r) => r !== role
            );
          }}
        />
      {/if}
    {/each}
  </div>
</Row>

<ToggledContent enabled={dataState.serverSettings.modules.fireboard}>
  <div class="flex flex-col gap-4">
    <Button
      onclick={() => {
        dataState.pageSettings.boards.push(createBlankBoard());
      }}
      disabled={data.serverInfo.limits.enforcing &&
        dataState.pageSettings.boards.length >= data.serverInfo.limits.fireboards}
    >
      <Plus size={20} />
      Add Board
    </Button>

    {#if data.serverInfo.limits.enforcing}
      <LimitPill amount={dataState.pageSettings.boards.length} limit={data.serverInfo.limits.fireboards} />
    {/if}

    {#each dataState.pageSettings.boards as board, index (board.id)}
      <div animate:flip={{ duration: 400 }}>
        <Board
          bind:board={dataState.pageSettings.boards[index]}
          serverInfo={data.serverInfo}
          deleteThis={() => {
            dataState.pageSettings.boards.splice(index, 1);
          }}
        />
      </div>
    {/each}
  </div>
</ToggledContent>
