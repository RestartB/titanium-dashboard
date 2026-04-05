<script lang="ts">
  import { ToggleRow, AnchorRow, Row } from '$lib/components/ui/row';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import { ChevronRight, ScrollText } from '@lucide/svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import ChannelButton from '$lib/components/ui/discord/ChannelButton.svelte';

  const { data } = $props();
  let dataState = $state(data);
</script>

<Saver page="confessions" {data} bind:dataState />

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Confessions</h2>
    <p>Allow server members to make anonymous confessions.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.confessions} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.confessions}>
  <p class="text-base font-bold text-zinc-300/60">Channel</p>

  <ToggleRow bind:toggled={dataState.pageSettings.confessions_in_channel}>
    <div>
      <h2 class="text-xl font-bold">Send confessions in source channel</h2>
      <p>
        When this option is enabled, confessions will be sent in the channel where the command is used, instead of a
        dedicated confession channel.
      </p>
    </div>
  </ToggleRow>

  <ToggledContent enabled={!dataState.pageSettings.confessions_in_channel}>
    <Row>
      <div>
        <h2 class="text-xl font-bold">Confession Channel</h2>
        <p>
          Select a channel for confessions to be sent to. Make sure that Titanium has permissions to send messages in
          the channel.
        </p>
      </div>

      <ChannelButton
        categories={data.serverInfo.categories}
        bind:channel={dataState.pageSettings.confessions_channel_id}
        class="mt-2 bg-zinc-700"
      />
    </Row>
  </ToggledContent>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Confession Logs</p>

  <AnchorRow href="/guild/{dataState.serverInfo.id}/logging#titanium" Icon={ChevronRight} title="Configure Logs">
    <div class="flex h-full items-center gap-4">
      <div class="xs:flex hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-600">
        <ScrollText size={28} />
      </div>
      <div>
        <h2 class="text-xl font-bold">Log Channel</h2>
        <p>Go to the Titanium category on the logging page to add a channel for confession logs.</p>
      </div>
    </div>
  </AnchorRow>
</ToggledContent>
