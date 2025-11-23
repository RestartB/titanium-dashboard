<script lang="ts">
  import Rule from '$lib/components/bouncer/Rule.svelte';
  import Toggle from '$lib/components/ui/Toggle.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import { Plus } from '@lucide/svelte';
  import type { BouncerRuleSchema } from '$lib/validators/bouncer';

  const { data } = $props();
  let dataState = $state(data);

  function createBlankRule(): BouncerRuleSchema {
    return {
      id: '',
      enabled: true,
      actions: [],
      criteria: []
    };
  }
</script>

<Saver page="automod" {data} bind:dataState />

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Bouncer</h2>
    <p>Allow Titanium to monitor users as they join.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.automod} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.automod}>
  <Button
    onclick={() => {
      dataState.pageSettings.rules.push(createBlankRule());
    }}
  >
    <Plus size={20} />
    Add Rule
  </Button>

  {#each dataState.pageSettings.rules as _, index (index)}
    <Rule
      roles={dataState.serverInfo.roles}
      bind:rule={dataState.pageSettings.rules[index]}
      deleteThis={() => dataState.pageSettings.rules.splice(index, 1)}
    />
  {/each}
</ToggledContent>
