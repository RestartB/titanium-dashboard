<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import CriterionTile from './CriterionTile.svelte';
  import ActionTile from './ActionTile.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import CriterionPicker from './CriterionPicker.svelte';
  import ActionPicker from './ActionPicker.svelte';

  import { X, Plus } from '@lucide/svelte';
  import type { BouncerRule } from '$lib/types/bouncer';
  import type { RoleInfo } from '$lib/types/serverInfo';

  let {
    roles,
    rule = $bindable(),
    deleteThis
  }: { roles: RoleInfo[]; rule: BouncerRule; deleteThis: () => void } = $props();

  let createCriterionOpen = $state(false);
  let createActionOpen = $state(false);
</script>

{#if createCriterionOpen}
  <FullscreenOverlay bind:overlayOpen={createCriterionOpen}>
    <CriterionPicker bind:rule bind:overlayOpen={createCriterionOpen} />
  </FullscreenOverlay>
{/if}

{#if createActionOpen}
  <FullscreenOverlay bind:overlayOpen={createActionOpen}>
    <ActionPicker bind:rule bind:overlayOpen={createActionOpen} />
  </FullscreenOverlay>
{/if}

<Row>
  <h2 class="font-bold">Criteria</h2>
  <p>The criteria that must be met before actions are ran.</p>
  <div class="my-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-700 p-2">
    <button
      class="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base transition-colors hover:bg-zinc-600"
      onclick={() => (createCriterionOpen = true)}
    >
      <Plus size={16} />
      <p>Add Criterion...</p>
    </button>
    {#each rule.criteria as _, index (index)}
      <CriterionTile
        bind:criterion={rule.criteria[index]}
        deleteThis={() => rule.criteria.splice(index, 1)}
      />
    {/each}
  </div>

  <h2 class="font-bold">Actions</h2>
  <p>Ran when all criteria are met.</p>
  <div class="mt-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-700 p-2">
    <button
      class="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base transition-colors hover:bg-zinc-600"
      onclick={() => (createActionOpen = true)}
    >
      <Plus size={16} />
      <p>Add Action...</p>
    </button>
    {#each rule.actions as _, index (index)}
      <ActionTile
        {roles}
        bind:action={rule.actions[index]}
        deleteThis={() => rule.actions.splice(index, 1)}
      />
    {/each}
  </div>
</Row>
