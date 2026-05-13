<script lang="ts">
  import { flip } from 'svelte/animate';

  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import Board from '$lib/components/fireboard/Board.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import LimitPill from '$lib/components/ui/LimitPill.svelte';
  import { Plus } from '@lucide/svelte';

  import type { FireboardBoardSchema } from '$lib/validators/fireboard';

  let { data } = $props();
  let dataState = $state(data);

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

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Fireboard</h2>
    <p>Let server members highlight messages they love.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.fireboard} />
</div>

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
