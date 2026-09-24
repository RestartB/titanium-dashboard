<script lang="ts">
  import { Row, ToggleRow } from '$lib/components/ui/row';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import WordTile from '$lib/components/ui/WordTile.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';

  const { data } = $props();
  let dataState = $state(data);
</script>

<Saver {data} bind:dataState />

<div>
  <h2 class="text-4xl font-bold">General Settings</h2>
  <p>Change general settings like data retention.</p>
</div>

<p class="text-base font-bold text-zinc-300/60">Prefix Commands</p>

<Alert>Prefix commands have been removed due to Discord restrictions. Please use slash commands instead.</Alert>

<ToggleRow bind:toggled={dataState.serverSettings.settings.send_not_allowed}>
  <div>
    <h2 class="text-xl font-bold">Send Removed Error</h2>
    <p>Send a message warning that prefix commands have been removed if a user tries to run one.</p>
  </div>
</ToggleRow>

<ToggledContent enabled={false}>
  <Row>
    <h2 class="text-xl font-bold">Prefixes</h2>
    <p>
      Create and delete up to 5 prefixes that Titanium responds to. You can also mention Titanium or use slash commands.
    </p>
    <div class="mt-2 flex flex-wrap gap-2">
      {#each dataState.serverSettings.prefixes as prefix, index (index)}
        <WordTile word={prefix} deleteThis={() => dataState.serverSettings.prefixes.splice(index, 1)} />
      {/each}
    </div>
  </Row>
</ToggledContent>

<hr class="border-zinc-500" />
<p class="text-base font-bold text-zinc-300/60">Data Retention</p>

<ToggleRow bind:toggled={dataState.serverSettings.settings.delete_after_3_days}>
  <div>
    <h2 class="text-xl font-bold">Delete data after 3 days</h2>
    <p>
      When Titanium leaves your server, any data that was created will be preserved in Titanium's systems for around 3
      days - allowing you to add Titanium back and keep all data if you change your mind. With this option disabled,
      data about your server will be deleted immediately from Titanium's systems when it leaves.
    </p>
  </div>
</ToggleRow>

<Alert>Once data has been deleted, it can not be recovered by the Titanium developers.</Alert>
