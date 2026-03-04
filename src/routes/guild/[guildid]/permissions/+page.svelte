<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import RoleTile from '$lib/components/ui/discord/RoleTile.svelte';

  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';

  import { Plus } from '@lucide/svelte';

  const { data } = $props();
  let dataState = $state(data);

  let dashboardOverlayOpen = $state(false);
  let dashboardSelectedRole: string | undefined = $state();

  let caseOverlayOpen = $state(false);
  let caseSelectedRole: string | undefined = $state();

  $effect(() => {
    if (!dashboardSelectedRole) return;
    dataState.pageSettings.dashboard_managers.push(dashboardSelectedRole);
    dashboardSelectedRole = undefined;
  });

  $effect(() => {
    if (!caseSelectedRole) return;
    dataState.pageSettings.case_managers.push(caseSelectedRole);
    caseSelectedRole = undefined;
  });
</script>

<Saver {data} page="permissions" bind:dataState />

{#if dashboardOverlayOpen}
  <RolePicker
    roles={dataState.serverInfo.roles}
    bind:selectedRole={dashboardSelectedRole}
    bind:overlayOpen={dashboardOverlayOpen}
  />
{/if}

{#if caseOverlayOpen}
  <RolePicker
    roles={dataState.serverInfo.roles}
    bind:selectedRole={caseSelectedRole}
    bind:overlayOpen={caseOverlayOpen}
  />
{/if}

<div>
  <h2 class="text-4xl font-bold">Permissions</h2>
  <p>Change who can access the Titanium dashboard.</p>
</div>

<Row>
  <div>
    <h2 class="text-xl font-bold">Dashboard Managers</h2>
    <p class="mb-2">
      Dashboard Managers can fully manage Titanium from the dashboard, however, they will not have any special access to
      Titanium's commands past what their roles already provide. Roles with the Administrator permission will
      automatically be Dashboard Managers, but you can also add roles manually below.
    </p>
    <div class="flex flex-wrap gap-2">
      <Button onclick={() => (dashboardOverlayOpen = true)}><Plus size={20} /> Add Role</Button>
      {#each dataState.pageSettings.dashboard_managers as role}
        {@const foundRole = dataState.serverInfo.roles.find((r) => r.id === role)}
        {#if foundRole}
          <RoleTile
            role={foundRole}
            deleteThis={() => {
              dataState.pageSettings.dashboard_managers = dataState.pageSettings.dashboard_managers.filter(
                (r) => r !== role
              );
            }}
          />
        {/if}
      {/each}
    </div>
  </div></Row
>

<Row>
  <div>
    <h2 class="text-xl font-bold">Case Managers</h2>
    <p class="mb-2">
      Case Managers can view and manage moderation cases with the dashboard. This is useful for moderators to get an
      easier view of the server's cases. Roles with the Manage Server permission will automatically be Case Managers,
      but you can also add roles manually below.
    </p>

    <div class="flex flex-wrap gap-2">
      <Button onclick={() => (caseOverlayOpen = true)}><Plus size={20} /> Add Role</Button>
      {#each dataState.pageSettings.case_managers as role}
        {@const foundRole = dataState.serverInfo.roles.find((r) => r.id === role)}
        {#if foundRole}
          <RoleTile
            role={foundRole}
            deleteThis={() => {
              dataState.pageSettings.case_managers = dataState.pageSettings.case_managers.filter((r) => r !== role);
            }}
          />
        {/if}
      {/each}
    </div>
  </div>
</Row>
