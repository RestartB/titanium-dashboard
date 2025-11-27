<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Number from '$lib/components/ui/inputs/Number.svelte';
  import type { LeaderboardLevelSchema } from '$lib/validators';

  import { Save, X, Pen, Trash } from '@lucide/svelte';

  let {
    level = $bindable(),
    id,
    deleteLevel
  }: { level: LeaderboardLevelSchema; id: number; deleteLevel: () => void } = $props();

  let editedLevel = $state(level);
  let editModeEnabled = $state(false);
</script>

<Row>
  <div class="flex items-center gap-2">
    <p class="text-2xl"><strong>Level {id}</strong> - {level.xp_required}xp</p>
    {#if editModeEnabled}
      <Button
        class={editModeEnabled ? 'ml-auto' : ''}
        onclick={() => {
          level = { ...editedLevel };
          editModeEnabled = !editModeEnabled;
        }}
      >
        <Save size={20} />
      </Button>
    {/if}

    <Button
      class={editModeEnabled ? '' : 'ml-auto'}
      onclick={() => {
        editedLevel = { ...level };
        editModeEnabled = !editModeEnabled;
      }}
    >
      {#if editModeEnabled}<X size={20} />{/if}
      {#if !editModeEnabled}<Pen size={20} />{/if}
    </Button>

    <Button onclick={deleteLevel}>
      <Trash size={20} />
    </Button>
  </div>

  {#if editModeEnabled}
    <p class="mt-2 font-bold">XP Requirement</p>
    <p>The amount of XP required to reach the level.</p>

    <Number bind:value={editedLevel.xp_required} class="mt-2" />
  {/if}
</Row>
