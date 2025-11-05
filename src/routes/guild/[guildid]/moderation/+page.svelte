<script lang="ts">
  import { ToggleRow, AnchorRow } from '$lib/components/ui/row';
  import Saver from '$lib/components/Saver.svelte';
  import { ChevronRight } from '@lucide/svelte';

  const { data } = $props();
  let dataState = $state(data);

  let newPrefixInput = $state('');

  $effect(() => {
    if (newPrefixInput.length > 5) newPrefixInput = newPrefixInput.slice(0, 5);
  });
</script>

<Saver bind:dataState />

<div>
  <h2 class="text-4xl font-bold">Moderation</h2>
  <p>Moderate your server and manage cases.</p>
</div>

<AnchorRow
  href="/guild/{dataState.serverInfo.id}/moderation/cases"
  Icon={ChevronRight}
  title="View Cases"
>
  <div>
    <h2 class="text-xl font-bold">Cases</h2>
    <p>View moderation cases that have been created in this server.</p>
  </div>
</AnchorRow>

<ToggleRow bind:toggled={dataState.pageSettings.delete_confirmation}>
  <div>
    <h2 class="text-xl font-bold">Delete Confirmation Messages</h2>
    <p>
      Titanium will send a confirmation message to the current channel once a moderation action has
      been completed. When this option is enabled, the confirmation messages will delete
      automatically after 5 seconds.
    </p>
  </div>
</ToggleRow>

<ToggleRow bind:toggled={dataState.pageSettings.dm_users}>
  <div>
    <h2 class="text-xl font-bold">DM Users</h2>
    <p>
      When this option is enabled, Titanium will attempt to DM users when a moderation action is
      performed on them. This includes actions like bans, kicks, mutes, and warnings.
    </p>
  </div>
</ToggleRow>

<!-- <Row>
  <div>
    <h2 class="text-xl font-bold">Immune Roles</h2>
    <p>
      By default, Titanium will respect the role hierarchy when performing moderation actions.
      However, you can set specific roles to be immune from all moderation actions that are
      performed with Titanium.
    </p>
  </div>
</Row> -->
