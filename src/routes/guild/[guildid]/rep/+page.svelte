<script lang="ts">
  import { page } from '$app/state';

  import { ToggleRow, ButtonRow, Row } from '$lib/components/ui/row';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import ChannelTile from '$lib/components/ui/discord/ChannelTile.svelte';
  import RoleTile from '$lib/components/ui/discord/RoleTile.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';

  import Saver from '$lib/components/Saver.svelte';
  import { Plus, Copy, Check } from '@lucide/svelte';

  const { data } = $props();
  let dataState = $state(data);

  let channelOverlayOpen = $state(false);
  let roleOverlayOpen = $state(false);

  let Icon = $state(Copy);

  $effect(() => {
    if (dataState.pageSettings.ignored_channels.length >= 100) {
      channelOverlayOpen = false;
    }

    if (dataState.pageSettings.ignored_roles.length >= 100) {
      roleOverlayOpen = false;
    }
  });
</script>

<Saver page="rep" {data} bind:dataState />

{#if channelOverlayOpen}
  <ChannelPicker
    multiselect={true}
    categories={data.serverInfo.categories}
    bind:selectedChannels={dataState.pageSettings.ignored_channels}
    bind:overlayOpen={channelOverlayOpen}
  />
{/if}

{#if roleOverlayOpen}
  <RolePicker
    multiselect={true}
    roles={data.serverInfo.roles}
    bind:selectedRoles={dataState.pageSettings.ignored_roles}
    bind:overlayOpen={roleOverlayOpen}
  />
{/if}

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Rep</h2>
    <p>Thank members by giving them rep points.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.rep} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.rep}>
  <p class="text-base font-bold text-zinc-300/60">Rep Hint</p>

  <ToggleRow bind:toggled={dataState.pageSettings.rep_hint}>
    <div>
      <h2 class="text-xl font-bold">Rep Hint</h2>
      <p>
        With this option enabled, when Titanium detects a message containing words such as "thank you", "thanks" and
        "thx", it will automatically send a button that users can press to give the message author a rep point.
      </p>
    </div>
  </ToggleRow>

  <Row>
    <h2 class="text-xl font-bold">Ignored Channels</h2>
    <p class="mb-2">Select up to 100 channels where the rep hint will not be sent.</p>

    <div class="flex flex-wrap gap-2">
      {#if dataState.pageSettings.ignored_channels.length < 100}
        <Button smallPadding={true} onclick={() => (channelOverlayOpen = true)}
          ><Plus size={20} /> Add channels...</Button
        >
      {/if}

      {#each dataState.pageSettings.ignored_channels as channel (channel)}
        <ChannelTile
          {channel}
          categories={data.serverInfo.categories}
          deleteThis={() => {
            dataState.pageSettings.ignored_channels = dataState.pageSettings.ignored_channels.filter(
              (c) => c !== channel
            );
          }}
        />
      {/each}
    </div>
  </Row>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Rep Removal</p>

  <ToggleRow bind:toggled={dataState.pageSettings.allow_rep_remove}>
    <div>
      <h2 class="text-xl font-bold">Allow Rep Removal</h2>
      <p>
        Allow users to remove rep from other users. They will only be able to remove rep that they have given to the
        user.
      </p>
    </div>
  </ToggleRow>

  <ToggleRow bind:toggled={dataState.pageSettings.delete_leavers}>
    <div>
      <h2 class="text-xl font-bold">Delete Rep for leavers</h2>
      <p>
        When a member leaves the server and Titanium is online, their rep will be deleted. This keeps the leaderboard
        clean, but means that users who join back will have their rep reset.
      </p>
    </div>
  </ToggleRow>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Blocked Roles</p>

  <Row>
    <h2 class="text-xl font-bold">Blocked Roles</h2>
    <p class="mb-2">Select up to 100 roles that cannot earn rep.</p>

    <div class="flex flex-wrap gap-2">
      {#if dataState.pageSettings.ignored_roles.length < 100}
        <Button smallPadding={true} onclick={() => (roleOverlayOpen = true)}><Plus size={20} /> Add roles...</Button>
      {/if}

      {#each dataState.pageSettings.ignored_roles as role (role)}
        {@const foundRole = dataState.serverInfo.roles.find((r) => r.id === role)}
        {#if foundRole}
          <RoleTile
            role={foundRole}
            deleteThis={() => {
              dataState.pageSettings.ignored_roles = dataState.pageSettings.ignored_roles.filter((r) => r !== role);
            }}
          />
        {/if}
      {/each}
    </div>
  </Row>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Web Leaderboard</p>

  {#if data.pageSettings.web_leaderboard_enabled}
    <ButtonRow
      {Icon}
      onclick={async () => {
        await navigator.clipboard.writeText(`${page.url.origin}/public/lb/${data.serverInfo.id}`);
        Icon = Check;
        setTimeout(() => (Icon = Copy), 3000);
      }}
    >
      <p class="text-base font-bold text-zinc-300/60">Your leaderboard link</p>
      <p class="truncate">{page.url.origin}/public/rep/{data.serverInfo.id}</p>
    </ButtonRow>
  {/if}

  <ToggleRow bind:toggled={dataState.pageSettings.web_leaderboard_enabled}>
    <div>
      <h2 class="text-xl font-bold">Web Rep Leaderboard</h2>
      <p>
        Allow users to view the rep leaderboard from their web browser. This has more features and a nicer UI than the
        Discord command version.
      </p>
    </div>
  </ToggleRow>

  <ToggledContent bind:enabled={dataState.pageSettings.web_leaderboard_enabled}>
    <ToggleRow bind:toggled={dataState.pageSettings.web_login_required}>
      <div>
        <h2 class="text-xl font-bold">Require Discord Login</h2>
        <p>
          Users will have to log in with their Discord account before viewing the web rep leaderboard, to verify that
          they are in the server.
        </p>
      </div>
    </ToggleRow>
  </ToggledContent>
</ToggledContent>
