<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Toggle from '$lib/components/ui/Toggle.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import Board from '$lib/components/fireboard/Board.svelte';
  import Saver from '$lib/components/Saver.svelte';

  import { Plus } from '@lucide/svelte';

  import type { FireboardBoard } from '$lib/interfaces/fireboard';

  let { data } = $props();
  let dataState = $state(data);

  function createBlankBoard(): FireboardBoard {
    return {
      channel_id: '',
      reaction: '🔥',
      threshold: 5,
      ignore_bots: true,
      ignore_self_reactions: true,
      ignored_channels: [],
      ignored_roles: []
    };
  }
</script>

<Saver page="fireboard" bind:dataState />

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
    >
      <Plus size={20} />
      Add Board
    </Button>
    {#each dataState.pageSettings.boards as _, index (index)}
      <Board
        bind:board={dataState.pageSettings.boards[index]}
        serverInfo={data.serverInfo}
        deleteThis={() => {
          dataState.pageSettings.boards.splice(index, 1);
        }}
      />
    {/each}
  </div>
</ToggledContent>
