<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import NumberInput from '$lib/components/ui/inputs/Number.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import RoleTile from '$lib/components/ui/discord/RoleTile.svelte';
  import { Save, X, Pen, Trash, Plus } from '@lucide/svelte';

  import type { LeaderboardLevelSchema } from '$lib/validators';
  import type { ServerInfo } from '$lib/interfaces/serverInfo';

  let {
    level = $bindable(),
    id,
    serverInfo,
    deleteLevel
  }: { level: LeaderboardLevelSchema; id: number; serverInfo: ServerInfo; deleteLevel: () => void } = $props();

  let editedLevel = $state(level);
  let editModeEnabled = $state(false);
  let roleOverlayOpen = $state(false);

  $effect(() => {
    if (level.reward_roles.length >= 5) {
      roleOverlayOpen = false;
    }
  });
</script>

{#if roleOverlayOpen}
  <RolePicker
    multiselect={true}
    roles={serverInfo.roles}
    bind:selectedRoles={level.reward_roles}
    bind:overlayOpen={roleOverlayOpen}
  />
{/if}

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
    <NumberInput bind:value={editedLevel.xp_required} min={1} class="my-2" />

    <h2 class="text-xl font-bold">Level Roles</h2>
    <p class="mb-2">Select up to 5 roles that will be assigned at this level.</p>

    <div class="flex flex-wrap gap-2">
      {#if level.reward_roles.length < 5}
        <Button smallPadding={true} onclick={() => (roleOverlayOpen = true)}><Plus size={20} /> Add roles...</Button>
      {/if}

      {#each level.reward_roles as role (role)}
        {@const foundRole = serverInfo.roles.find((r) => r.id === role)}
        {#if foundRole}
          <RoleTile
            role={foundRole}
            deleteThis={() => {
              level.reward_roles = level.reward_roles.filter((r) => r !== role);
            }}
          />
        {/if}
      {/each}
    </div>
  {/if}
</Row>
