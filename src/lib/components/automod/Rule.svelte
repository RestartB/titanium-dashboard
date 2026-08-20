<script lang="ts">
  import { dragHandle } from 'svelte-dnd-action';

  import Row from '$lib/components/ui/row/Row.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import CriterionTile from './CriterionTile.svelte';
  import ActionTile from '$lib/components/ui/ActionTile.svelte';
  import CriterionPicker from './CriterionPicker.svelte';
  import ActionPicker from '$lib/components/pickers/ActionPicker.svelte';

  import { GripVertical, Trash, Plus } from '@lucide/svelte';

  import type { ServerBranding, ServerInfo } from '$lib/interfaces/serverInfo';
  import type { AutomodRuleSchema } from '$lib/validators';

  let {
    serverBranding,
    serverInfo,
    limit,
    enforcingLimit,
    rule = $bindable(),
    deleteThis
  }: {
    serverBranding: ServerBranding;
    serverInfo: ServerInfo;
    limit: number;
    enforcingLimit: boolean;
    rule: AutomodRuleSchema;
    deleteThis: () => void;
  } = $props();

  let createCriterionOpen = $state(false);
  let createActionOpen = $state(false);
</script>

{#if createCriterionOpen}
  <CriterionPicker bind:rule bind:overlayOpen={createCriterionOpen} />
{/if}

{#if createActionOpen}
  <ActionPicker type="automod" bind:rule bind:overlayOpen={createActionOpen} />
{/if}

<div>
  <Row class="space-y-2">
    <div class="flex flex-wrap items-center gap-4">
      <button class="cursor-grab touch-none text-zinc-300 active:cursor-grabbing" use:dragHandle aria-label="Drag rule">
        <GripVertical />
      </button>
      <input class="min-w-16 flex-1 truncate" placeholder="Enter rule name..." bind:value={rule.rule_name} />
      <Toggle bind:toggled={rule.enabled} />

      <button
        class="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-red-600 bg-red-700 p-2 px-2 text-base transition-colors hover:bg-red-600 sm:p-1"
        onclick={deleteThis}
      >
        <Trash size={16} class="shrink-0" />
        <p class="hidden sm:block">Delete Rule</p>
      </button>
    </div>

    <div
      class="space-y-2 transition-opacity"
      class:opacity-30={!rule.enabled}
      class:pointer-events-none={!rule.enabled}
      class:select-none={!rule.enabled}
    >
      <div>
        <h2 class="font-bold">Criteria</h2>
        <p>The criteria that must be met before actions are ran.</p>
        <div class="mt-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-700 p-2">
          <button
            class="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base transition-colors hover:bg-zinc-600"
            onclick={() => (createCriterionOpen = true)}
          >
            <Plus size={16} />
            <p>Add Criterion...</p>
          </button>
          {#each rule?.criteria as _, index (index)}
            <CriterionTile
              {limit}
              {enforcingLimit}
              bind:criterion={rule.criteria[index]}
              deleteThis={() => rule.criteria.splice(index, 1)}
            />
          {/each}
        </div>
      </div>

      <div>
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
            <ActionTile
              {serverBranding}
              {serverInfo}
              actionKind="automod"
              bind:action={rule.actions[index]}
              deleteThis={() => rule.actions.splice(index, 1)}
            />
          {/each}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Toggle bind:toggled={rule.evaluate_edits} />
        <p>Run this rule for edits</p>
      </div>
      <div class="flex items-center gap-2">
        <Toggle bind:toggled={rule.match_all_criteria} />
        <p>Require all criteria to match before triggering</p>
      </div>
      <div class="flex items-center gap-2">
        <Toggle bind:toggled={rule.stop_if_triggered} />
        <p>Stop processing further rules if this one matches</p>
      </div>
    </div>
  </Row>
</div>
