<script lang="ts">
  import { fly } from 'svelte/transition';

  import Row from '$lib/components/ui/row/Row.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import CriterionTile from './CriterionTile.svelte';
  import ActionTile from '$lib/components/ui/ActionTile.svelte';
  import CriterionPicker from './CriterionPicker.svelte';
  import ActionPicker from '$lib/components/pickers/ActionPicker.svelte';

  import { X, Plus } from '@lucide/svelte';
  import type { BouncerRuleSchema } from '$lib/validators/bouncer';
  import type { RoleInfo } from '$lib/interfaces/serverInfo';

  let {
    roles,
    rule = $bindable(),
    deleteThis
  }: { roles: RoleInfo[]; rule: BouncerRuleSchema; deleteThis: () => void } = $props();

  let createCriterionOpen = $state(false);
  let createActionOpen = $state(false);
</script>

{#if createCriterionOpen}
  <CriterionPicker bind:rule bind:overlayOpen={createCriterionOpen} />
{/if}

{#if createActionOpen}
  <ActionPicker type="bouncer" bind:rule bind:overlayOpen={createActionOpen} />
{/if}

<div transition:fly={{ y: -20, duration: 200 }}>
  <Row>
    <div class="flex w-full items-center">
      <div>
        <h2 class="font-bold">Criteria</h2>
        <p>The criteria that must be met before actions are ran.</p>
      </div>
      <button
        class="mb-auto ml-auto flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-red-600 bg-red-700 p-2 px-2 text-base transition-colors hover:bg-red-600 sm:p-1"
        onclick={deleteThis}
      >
        <X size={16} class="shrink-0" />
        <p class="hidden sm:block">Delete Rule</p>
      </button>
    </div>
    <div class="my-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-700 p-2">
      <button
        class="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base transition-colors hover:bg-zinc-600"
        onclick={() => (createCriterionOpen = true)}
      >
        <Plus size={16} />
        <p>Add Criterion...</p>
      </button>
      {#each rule?.criteria as _, index (index)}
        <CriterionTile bind:criterion={rule.criteria[index]} deleteThis={() => rule.criteria.splice(index, 1)} />
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
      {#each rule?.actions as _, index (index)}
        <ActionTile {roles} bind:action={rule.actions[index]} deleteThis={() => rule.actions.splice(index, 1)} />
      {/each}
    </div>

    <div class="mt-2 flex items-center gap-2">
      <Toggle bind:toggled={rule.evaluate_for_existing_members} />
      <p>Also check this rule when users update their profile.</p>
    </div>
  </Row>
</div>
