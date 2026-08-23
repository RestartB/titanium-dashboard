<script lang="ts">
  import { page } from '$app/state';
  import { DiscordPermission } from '$lib/helpers/discord';

  import ChannelButton from '$lib/components/ui/discord/ChannelButton.svelte';
  import Collapsible from '$lib/components/ui/Collapsible.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import Assistant from '$lib/components/permissions/Assistant.svelte';
  import PermRow from '$lib/components/permissions/PermRow.svelte';
  import Row from '$lib/components/ui/row/Row.svelte';
  import WordTile from '$lib/components/ui/WordTile.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import RoleTile from '$lib/components/ui/discord/RoleTile.svelte';
  import { ListPlus, ListX, Plus, X } from '@lucide/svelte';

  import type { LoggingEvent } from '$lib/interfaces/logging';

  let { data } = $props();
  let dataState = $state(data);

  let selectAllOpen = $state(false);
  let categoryOpen = $state(false);
  let selectedCategory = '';
  const categories = [...new Set(data.loggingEvents.map((event) => event.category))].sort();

  let newIgnoredCreatorId = $state('');
  let newIgnoredTargetId = $state('');
  let creatorRolesOverlayOpen = $state(false);
  let targetRolesOverlayOpen = $state(false);
</script>

{#snippet loggingEventRow(eventType: LoggingEvent)}
  <li
    class="flex w-full flex-col gap-1 rounded-lg bg-zinc-700 p-2 px-4 xs:flex-row xs:items-center xs:justify-between xs:gap-2"
  >
    <div>
      <p class="font-bold">{eventType.name}</p>
      <p class="text-base text-zinc-400">{eventType.description}</p>
    </div>

    <div class="flex shrink-0 flex-wrap items-center gap-2 overflow-auto">
      {#if dataState.pageSettings.channels[eventType.event]}
        <Button
          onclick={() => {
            delete dataState.pageSettings.channels[eventType.event];
          }}
          class="bg-zinc-800 p-2"
          border={false}
        >
          <X size={20} />
        </Button>
      {/if}

      <ChannelButton
        categories={data.serverInfo.categories}
        channel={dataState.pageSettings.channels[eventType.event]}
        onSelect={(channel) => {
          dataState.pageSettings.channels[eventType.event] = channel;
        }}
        class="bg-zinc-800"
      />
    </div>
  </li>
{/snippet}

{#snippet collapsibleTitle(category: string)}
  <h3 class="mr-auto text-left font-bold">{category}</h3>
  <button
    class="flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-zinc-800 p-1 px-2 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
    onclick={(event) => {
      event.stopPropagation();
      selectedCategory = category;
      categoryOpen = !categoryOpen;
    }}
  >
    Select channel...
  </button>
{/snippet}

{#if creatorRolesOverlayOpen}
  <RolePicker
    multiselect={true}
    roles={data.serverInfo.roles}
    bind:selectedRoles={dataState.pageSettings.ignored_creator_role_ids}
    bind:overlayOpen={creatorRolesOverlayOpen}
  />
{/if}

{#if targetRolesOverlayOpen}
  <RolePicker
    multiselect={true}
    roles={data.serverInfo.roles}
    bind:selectedRoles={dataState.pageSettings.ignored_target_role_ids}
    bind:overlayOpen={targetRolesOverlayOpen}
  />
{/if}

<Saver page="logging" {data} bind:dataState />

{#if selectAllOpen}
  <ChannelPicker
    categories={data.serverInfo.categories}
    onSelect={(channel) => {
      dataState.pageSettings.channels = {};
      for (const event of dataState.loggingEvents) {
        dataState.pageSettings.channels[event.event] = channel;
      }
    }}
    bind:overlayOpen={selectAllOpen}
  />
{/if}

{#if categoryOpen}
  <ChannelPicker
    categories={data.serverInfo.categories}
    onSelect={(channel) => {
      for (const eventType of data.loggingEvents) {
        if (eventType.category !== selectedCategory) {
          continue;
        }
        dataState.pageSettings.channels[eventType.event] = channel;
      }
    }}
    bind:overlayOpen={categoryOpen}
  />
{/if}

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Logging</h2>
    <p>Set log channels for various events that happen in your server.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.logging} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.logging}>
  <Assistant
    permissions={BigInt(data.serverInfo.bot_permissions)}
    allRequired={DiscordPermission.ManageWebhooks |
      DiscordPermission.ViewAuditLog |
      DiscordPermission.ManageGuild |
      DiscordPermission.ManageChannels}
  >
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={DiscordPermission.ManageWebhooks}
      title="Manage Webhooks"
      description="Allows Titanium to create logging webhooks."
    />
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={DiscordPermission.ViewAuditLog}
      title="View Audit Log"
      description="Allows Titanium to get events from the audit log."
    />
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={DiscordPermission.ManageGuild}
      title="Manage Server"
      description="Allows Titanium to see when Discord automod rules are updated."
    />
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={DiscordPermission.ManageChannels}
      title="Manage Channels"
      description="Allows Titanium to see when invites are created and deleted."
    />
  </Assistant>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Ignored Creators</p>

  <Row>
    <h2 class="text-xl font-bold">Ignored Creator Roles</h2>
    <p class="mb-2">
      Set up to 100 roles where Titanium will not create logs if a user with a selected role has created the action. For
      example, if the user bans someone or if the user updates someone's nickname.
    </p>

    <div class="flex flex-wrap gap-2">
      {#if dataState.pageSettings.ignored_creator_role_ids.length < 100}
        <Button smallPadding={true} onclick={() => (creatorRolesOverlayOpen = true)}
          ><Plus size={20} /> Add roles...</Button
        >
      {/if}

      {#each dataState.pageSettings.ignored_creator_role_ids as role (role)}
        {@const foundRole = dataState.serverInfo.roles.find((r) => r.id === role)}
        {#if foundRole}
          <RoleTile
            role={foundRole}
            deleteThis={() => {
              dataState.pageSettings.ignored_creator_role_ids = dataState.pageSettings.ignored_creator_role_ids.filter(
                (r) => r !== role
              );
            }}
          />
        {/if}
      {/each}
    </div>
  </Row>

  <Row>
    <h2 class="text-xl font-bold">Ignored Creator User IDs</h2>
    <p class="mb-2">
      Enter up to 100 user IDs where Titanium will not create logs if the user has created the action. For example, if
      the user bans someone or if the user updates someone's nickname.
    </p>

    <div class="flex flex-wrap gap-2">
      {#if dataState.pageSettings.ignored_creator_user_ids.length < 100}
        <div
          class="flex w-full max-w-60 items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
        >
          <input
            type="text"
            placeholder="Enter user ID..."
            class="h-full w-full"
            onkeydown={(e) => {
              newIgnoredCreatorId = newIgnoredCreatorId.replace(/\D/g, '');
              if (
                e.key === 'Enter' &&
                newIgnoredCreatorId &&
                newIgnoredCreatorId.length >= 17 &&
                newIgnoredCreatorId.length <= 20
              ) {
                dataState.pageSettings.ignored_creator_user_ids.push(newIgnoredCreatorId);
                newIgnoredCreatorId = '';
              }
            }}
            bind:value={newIgnoredCreatorId}
          />
          <button
            class="cursor-pointer rounded-lg p-1 transition-colors hover:bg-zinc-600"
            onclick={() => {
              newIgnoredCreatorId = newIgnoredCreatorId.replace(/\D/g, '');
              if (newIgnoredCreatorId && newIgnoredCreatorId.length >= 17 && newIgnoredCreatorId.length <= 20) {
                dataState.pageSettings.ignored_creator_user_ids.push(newIgnoredCreatorId);
                newIgnoredCreatorId = '';
              }
            }}
            aria-label="Add user ID"
          >
            <Plus size={16} />
          </button>
        </div>
      {/if}
      {#each dataState.pageSettings.ignored_creator_user_ids as prefix, index (index)}
        <WordTile word={prefix} deleteThis={() => dataState.pageSettings.ignored_creator_user_ids.splice(index, 1)} />
      {/each}
    </div>
  </Row>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Ignored Targets</p>

  <Row>
    <h2 class="text-xl font-bold">Ignored Target Roles</h2>
    <p class="mb-2">
      Set up to 100 roles where Titanium will not create logs if the action affects a user with a selected role. For
      example, if the user is banned, or if the user updates their PFP.
    </p>

    <div class="flex flex-wrap gap-2">
      {#if dataState.pageSettings.ignored_target_role_ids.length < 100}
        <Button smallPadding={true} onclick={() => (targetRolesOverlayOpen = true)}
          ><Plus size={20} /> Add roles...</Button
        >
      {/if}

      {#each dataState.pageSettings.ignored_target_role_ids as role (role)}
        {@const foundRole = dataState.serverInfo.roles.find((r) => r.id === role)}
        {#if foundRole}
          <RoleTile
            role={foundRole}
            deleteThis={() => {
              dataState.pageSettings.ignored_target_role_ids = dataState.pageSettings.ignored_target_role_ids.filter(
                (r) => r !== role
              );
            }}
          />
        {/if}
      {/each}
    </div>
  </Row>

  <Row>
    <h2 class="text-xl font-bold">Ignored Target User IDs</h2>
    <p class="mb-2">
      Enter up to 100 user IDs where Titanium will not create logs if the action affects them. For example, if the user
      is banned, or if the user updates their PFP.
    </p>

    <div class="flex flex-wrap gap-2">
      {#if dataState.pageSettings.ignored_target_user_ids.length < 100}
        <div
          class="flex w-full max-w-60 items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
        >
          <input
            type="text"
            placeholder="Enter user ID..."
            class="h-full w-full"
            onkeydown={(e) => {
              newIgnoredTargetId = newIgnoredTargetId.replace(/\D/g, '');
              if (
                e.key === 'Enter' &&
                newIgnoredTargetId &&
                newIgnoredTargetId.length >= 17 &&
                newIgnoredTargetId.length <= 20
              ) {
                dataState.pageSettings.ignored_target_user_ids.push(newIgnoredTargetId);
                newIgnoredTargetId = '';
              }
            }}
            bind:value={newIgnoredTargetId}
          />
          <button
            class="cursor-pointer rounded-lg p-1 transition-colors hover:bg-zinc-600"
            onclick={() => {
              newIgnoredTargetId = newIgnoredTargetId.replace(/\D/g, '');
              if (newIgnoredTargetId && newIgnoredTargetId.length >= 17 && newIgnoredTargetId.length <= 20) {
                dataState.pageSettings.ignored_target_user_ids.push(newIgnoredTargetId);
                newIgnoredTargetId = '';
              }
            }}
            aria-label="Add user ID"
          >
            <Plus size={16} />
          </button>
        </div>
      {/if}
      {#each dataState.pageSettings.ignored_target_user_ids as prefix, index (index)}
        <WordTile word={prefix} deleteThis={() => dataState.pageSettings.ignored_target_user_ids.splice(index, 1)} />
      {/each}
    </div>
  </Row>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Channels</p>

  <div class="flex items-center gap-2">
    <Button
      onclick={() => {
        selectAllOpen = true;
      }}
    >
      <ListPlus size={20} />
      Set All Channels
    </Button>

    <Button onclick={() => (dataState.pageSettings.channels = {})}>
      <ListX size={20} />
      Clear All
    </Button>
  </div>

  <Collapsible defaultState={page.url.hash === '#titanium' ? true : false}>
    {#snippet topRow()}
      {@render collapsibleTitle('Titanium')}
    {/snippet}

    <ul class="flex flex-col gap-2">
      {#each data.loggingEvents.filter((event) => event.category === 'Titanium') as event (event.event)}
        {@render loggingEventRow(event)}
      {/each}
    </ul>
  </Collapsible>

  <hr class="border-zinc-500 last:hidden" />

  {#each categories.filter((category) => category !== 'Titanium') as category (category)}
    <Collapsible>
      {#snippet topRow()}
        {@render collapsibleTitle(category)}
      {/snippet}

      <ul class="flex flex-col gap-2">
        {#each data.loggingEvents.filter((event) => event.category === category) as event (event.event)}
          {@render loggingEventRow(event)}
        {/each}
      </ul>
    </Collapsible>

    <hr class="border-zinc-500 last:hidden" />
  {/each}
</ToggledContent>
