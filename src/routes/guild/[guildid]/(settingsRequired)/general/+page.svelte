<script lang="ts">
  import { Row, ToggleRow } from '$lib/components/ui/row';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import ChannelTile from '$lib/components/ui/discord/ChannelTile.svelte';
  import WordTile from '$lib/components/ui/WordTile.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import RoleTile from '$lib/components/ui/discord/RoleTile.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import { Plus } from '@lucide/svelte';

  const { data } = $props();
  let dataState = $state(data);

  let channelOverlayOpen = $state(false);
  let roleOverlayOpen = $state(false);

  let newPrefixInput = $state('');

  $effect(() => {
    if (newPrefixInput.length > 5) newPrefixInput = newPrefixInput.slice(0, 5);
  });

  $effect(() => {
    if (dataState.serverSettings.settings.blocked_channels.length >= 100) {
      channelOverlayOpen = false;
    }

    if (dataState.serverSettings.settings.blocked_roles.length >= 100) {
      roleOverlayOpen = false;
    }
  });
</script>

<Saver {data} bind:dataState />

{#if channelOverlayOpen}
  <ChannelPicker
    multiselect={true}
    categories={data.serverInfo.categories}
    bind:selectedChannels={dataState.serverSettings.settings.blocked_channels}
    bind:overlayOpen={channelOverlayOpen}
  />
{/if}

{#if roleOverlayOpen}
  <RolePicker
    multiselect={true}
    roles={data.serverInfo.roles}
    bind:selectedRoles={dataState.serverSettings.settings.blocked_roles}
    bind:overlayOpen={roleOverlayOpen}
  />
{/if}

<div>
  <h2 class="text-4xl font-bold">General Settings</h2>
  <p>Change general settings like prefixes and data retention.</p>
</div>

<p class="text-base font-bold text-zinc-300/60">Prefix Commands</p>

<Alert>Prefix commands will be removed from Titanium in mid-late September due to Discord restrictions.</Alert>

<ToggleRow bind:toggled={dataState.serverSettings.settings.allow_prefix}>
  <div>
    <h2 class="text-xl font-bold">Allow Prefix Commands</h2>
    <p>
      Allow server members to interact with Titanium using prefix commands, as well as slash commands. Slash commands
      are always enabled.
    </p>
  </div>
</ToggleRow>

<ToggleRow bind:toggled={dataState.serverSettings.settings.send_not_allowed}>
  <div>
    <h2 class="text-xl font-bold">Send Not Allowed Error</h2>
    <p>
      Send a not allowed error to the user if they try to run prefix commands when they are disabled, in a blacklisted
      channel, or when they have a blacklisted role.
    </p>
  </div>
</ToggleRow>

<ToggledContent enabled={dataState.serverSettings.settings.allow_prefix}>
  <ToggleRow bind:toggled={dataState.serverSettings.settings.loading_reaction}>
    <div>
      <h2 class="text-xl font-bold">Show Loading Reaction</h2>
      <p>
        Enable or disable the loading reaction that appears when Titanium is processing a prefix command. The loading
        indicator will always show for slash commands.
      </p>
    </div>
  </ToggleRow>

  <Row>
    <h2 class="text-xl font-bold">Prefixes</h2>
    <p>
      Create and delete up to 5 prefixes that Titanium responds to. You can also mention Titanium or use slash commands.
    </p>
    <div class="mt-2 flex flex-wrap gap-2">
      {#if dataState.serverSettings.prefixes.length < 5}
        <div
          class="flex max-w-35 items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
        >
          <input
            type="text"
            placeholder="Add prefix..."
            class="h-full w-full"
            onkeydown={(e) => {
              if (e.key === 'Enter' && newPrefixInput) {
                dataState.serverSettings.prefixes.push(newPrefixInput);
                newPrefixInput = '';
              }
            }}
            bind:value={newPrefixInput}
          />
          <button
            class="cursor-pointer rounded-lg p-1 transition-colors hover:bg-zinc-600"
            onclick={() => {
              if (newPrefixInput) {
                dataState.serverSettings.prefixes.push(newPrefixInput);
                newPrefixInput = '';
              }
            }}
            aria-label="Add prefix"
          >
            <Plus size={16} />
          </button>
        </div>
      {/if}
      {#each dataState.serverSettings.prefixes as prefix, index (index)}
        <WordTile word={prefix} deleteThis={() => dataState.serverSettings.prefixes.splice(index, 1)} />
      {/each}
    </div>
  </Row>

  <Row>
    <h2 class="text-xl font-bold">Blocked Channels</h2>
    <p class="mb-2">Select up to 100 channels where prefix commands cannot be executed.</p>

    <div class="flex flex-wrap gap-2">
      {#if dataState.serverSettings.settings.blocked_channels.length < 100}
        <Button smallPadding={true} onclick={() => (channelOverlayOpen = true)}
          ><Plus size={20} /> Add channels...</Button
        >
      {/if}

      {#each dataState.serverSettings.settings.blocked_channels as channel (channel)}
        <ChannelTile
          {channel}
          categories={data.serverInfo.categories}
          deleteThis={() => {
            dataState.serverSettings.settings.blocked_channels =
              dataState.serverSettings.settings.blocked_channels.filter((c) => c !== channel);
          }}
        />
      {/each}
    </div>
  </Row>

  <Row>
    <h2 class="text-xl font-bold">Blocked Roles</h2>
    <p class="mb-2">Select up to 100 roles that are not allowed to execute prefix commands.</p>

    <div class="flex flex-wrap gap-2">
      {#if dataState.serverSettings.settings.blocked_roles.length < 100}
        <Button smallPadding={true} onclick={() => (roleOverlayOpen = true)}><Plus size={20} /> Add roles...</Button>
      {/if}

      {#each dataState.serverSettings.settings.blocked_roles as role (role)}
        {@const foundRole = dataState.serverInfo.roles.find((r) => r.id === role)}
        {#if foundRole}
          <RoleTile
            role={foundRole}
            deleteThis={() => {
              dataState.serverSettings.settings.blocked_roles = dataState.serverSettings.settings.blocked_roles.filter(
                (r) => r !== role
              );
            }}
          />
        {/if}
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
