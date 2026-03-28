<script lang="ts">
  import { Row, ToggleRow, AnchorRow } from '$lib/components/ui/row';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import NumberInput from '$lib/components/ui/inputs/Number.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import Beta from '$lib/components/ui/Beta.svelte';
  import { ChevronRight, Book } from '@lucide/svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';

  const { data } = $props();
  let dataState = $state(data);
</script>

<Saver page="moderation" {data} bind:dataState />

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Moderation</h2>
    <p>Moderate your server and manage cases.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.moderation} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.moderation}>
  <AnchorRow href="/guild/{dataState.serverInfo.id}/moderation/cases" Icon={ChevronRight} title="View Cases">
    <div class="flex h-full w-full items-center gap-4">
      <div class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-600 xxs:flex">
        <Book size={28} />
      </div>
      <div>
        <h2 class="text-xl font-bold">Cases</h2>
        <p>View moderation cases that have been created in this server.</p>
      </div>
      <Beta class="ml-auto w-fit shrink-0" />
    </div>
  </AnchorRow>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">General Settings</p>

  <ToggleRow bind:toggled={dataState.pageSettings.delete_confirmation}>
    <div>
      <h2 class="text-xl font-bold">Delete Confirmation Messages</h2>
      <p>
        Titanium will send a confirmation message to the current channel once a moderation action has been completed.
        When this option is enabled, the confirmation messages will delete automatically after 5 seconds.
      </p>
    </div>
  </ToggleRow>

  <ToggleRow bind:toggled={dataState.pageSettings.dm_users}>
    <div>
      <h2 class="text-xl font-bold">DM Users</h2>
      <p>
        When this option is enabled, Titanium will attempt to DM users when a case is created against them as a result
        of a moderation action. This includes actions like bans, kicks, mutes, and warnings.
      </p>
    </div>
  </ToggleRow>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">External Cases</p>

  <ToggleRow bind:toggled={dataState.pageSettings.external_cases}>
    <div>
      <h2 class="text-xl font-bold">Create External Cases</h2>
      <p>
        Titanium will monitor the server's audit log, and create cases for users punished not using Titanium - for
        example, using the built in Discord tools or a different moderation bot.
      </p>
    </div>
  </ToggleRow>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Punishment Defaults</p>

  <Row>
    <div>
      <h2 class="text-xl font-bold">Ban Delete Days</h2>
      <p>
        Enter the amount of days of a user's messages that should be purged when a user is banned from the server. A max
        of 7 days is allowed. Enter 0 to disable.
      </p>
    </div>
    <NumberInput bind:value={dataState.pageSettings.ban_days} min={0} max={7} class="mt-2" />
  </Row>
</ToggledContent>
