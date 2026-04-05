<script lang="ts">
  import { flip } from 'svelte/animate';

  import Rule from '$lib/components/bouncer/Rule.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import { AnchorRow } from '$lib/components/ui/row';
  import Alert from '$lib/components/ui/Alert.svelte';
  import { Plus, ScrollText, ChevronRight } from '@lucide/svelte';
  import type { BouncerRuleSchema } from '$lib/validators/bouncer';

  const { data } = $props();
  let dataState = $state(data);

  function createBlankRule(): BouncerRuleSchema {
    return {
      id: crypto.randomUUID(),
      enabled: true,
      evaluate_for_existing_members: true,
      actions: [],
      criteria: []
    };
  }
</script>

<Saver page="bouncer" {data} bind:dataState />

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Bouncer</h2>
    <p>Monitor users as they join and update their profiles.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.bouncer} />
</div>

{#if !dataState.serverSettings.modules.moderation}
  <Alert>To enable this module, enable the Moderation module first.</Alert>
{/if}

<ToggledContent enabled={dataState.serverSettings.modules.bouncer && dataState.serverSettings.modules.moderation}>
  <AnchorRow href="/guild/{dataState.serverInfo.id}/logging#titanium" Icon={ChevronRight} title="Configure Logs">
    <div class="flex h-full items-center gap-4">
      <div class="xs:flex hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-600">
        <ScrollText size={28} />
      </div>
      <div>
        <h2 class="text-xl font-bold">Log Channel</h2>
        <p>Go to the Titanium category on the logging page to add a channel for bouncer logs.</p>
      </div>
    </div>
  </AnchorRow>

  <Button
    onclick={() => {
      dataState.pageSettings.rules.push(createBlankRule());
    }}
  >
    <Plus size={20} />
    Add Rule
  </Button>

  {#each dataState.pageSettings.rules as rule, index (rule.id)}
    <div animate:flip={{ duration: 400 }}>
      <Rule
        roles={dataState.serverInfo.roles}
        bind:rule={dataState.pageSettings.rules[index]}
        deleteThis={() => dataState.pageSettings.rules.splice(index, 1)}
      />
    </div>
  {/each}
</ToggledContent>
