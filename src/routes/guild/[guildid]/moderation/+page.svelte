<script lang="ts">
  import { ToggleRow, AnchorRow } from '$lib/components/ui/row';
  import Saver from '$lib/components/Saver.svelte';
  import { ChevronRight } from '@lucide/svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';

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

<ToggledContent enabled={dataState.serverSettings.modules.moderation}>
  <AnchorRow href="/guild/{dataState.serverInfo.id}/moderation/cases" Icon={ChevronRight} title="View Cases">
    <div>
      <h2 class="text-xl font-bold">Cases</h2>
      <p>View moderation cases that have been created in this server.</p>
    </div>
  </AnchorRow>

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

  <ToggleRow bind:toggled={dataState.pageSettings.external_cases}>
    <div>
      <h2 class="text-xl font-bold">Create External Cases</h2>
      <p>
        When someone is punished using the built in Discord mod tools or another bot, Titanium will create a case for
        the user.
      </p>
    </div>
  </ToggleRow>

  <ToggledContent bind:enabled={dataState.pageSettings.external_cases}>
    <ToggleRow bind:toggled={dataState.pageSettings.external_case_dms}>
      <div>
        <h2 class="text-xl font-bold">Send External Cases DMs</h2>
        <p>
          When a external case is created, Titanium will attempt to DM the user informing them of the action taken.
          Enable with caution - this can cause the user to recieve a DM from the original bot, and a DM from Titanium.
        </p>
      </div>
    </ToggleRow>
  </ToggledContent>

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
</ToggledContent>
