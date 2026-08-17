<script lang="ts">
  import { flip } from 'svelte/animate';
  import { dragHandleZone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
  import { DiscordPermission } from '$lib/helpers/discord';

  import { AnchorRow, Row, ToggleRow } from '$lib/components/ui/row';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Rule from '$lib/components/automod/Rule.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Tip from '$lib/components/ui/Tip.svelte';
  import LimitPill from '$lib/components/ui/LimitPill.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import ChannelTile from '$lib/components/ui/discord/ChannelTile.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import RoleTile from '$lib/components/ui/discord/RoleTile.svelte';
  import Assistant from '$lib/components/permissions/Assistant.svelte';
  import PermRow from '$lib/components/permissions/PermRow.svelte';
  import { ScrollText, ChevronRight, Plus } from '@lucide/svelte';

  import type { AutomodRuleSchema } from '$lib/validators/automod';
  import type { DndEvent } from 'svelte-dnd-action';

  type DndAutomodRule = AutomodRuleSchema & Partial<Record<typeof SHADOW_ITEM_MARKER_PROPERTY_NAME, boolean>>;

  let { data } = $props();
  let dataState = $state(data);

  let channelOverlayOpen = $state(false);
  let roleOverlayOpen = $state(false);
  const flipDurationMs = 300;

  function createBlankRule(order: number): AutomodRuleSchema {
    return {
      id: crypto.randomUUID(),
      rule_name: '',
      enabled: true,
      evaluate_edits: true,
      match_all_criteria: true,
      order: order,
      stop_if_triggered: false,
      actions: [],
      criteria: []
    };
  }

  function handleSort(e: CustomEvent<DndEvent<AutomodRuleSchema>>) {
    dataState.pageSettings.rules = e.detail.items.map((rule, order) => ({
      ...rule,
      order
    }));
  }

  function getShadowMarker(rule: AutomodRuleSchema) {
    return (rule as DndAutomodRule)[SHADOW_ITEM_MARKER_PROPERTY_NAME];
  }
</script>

{#if channelOverlayOpen}
  <ChannelPicker
    multiselect={true}
    categories={data.serverInfo.categories}
    bind:selectedChannels={dataState.pageSettings.global_ignored_channels}
    bind:overlayOpen={channelOverlayOpen}
  />
{/if}

{#if roleOverlayOpen}
  <RolePicker
    multiselect={true}
    roles={data.serverInfo.roles}
    bind:selectedRoles={dataState.pageSettings.global_ignored_roles}
    bind:overlayOpen={roleOverlayOpen}
  />
{/if}

<Saver page="automod" {data} bind:dataState />

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Automod</h2>
    <p>Set up automated moderation actions for your server.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.automod} />
</div>

{#if !dataState.serverSettings.modules.moderation}
  <Alert>To enable this feature, enable the Moderation feature first.</Alert>
{/if}

<ToggledContent enabled={dataState.serverSettings.modules.automod && dataState.serverSettings.modules.moderation}>
  <Assistant
    permissions={BigInt(data.serverInfo.bot_permissions)}
    allRequired={DiscordPermission.ModerateMembers |
      DiscordPermission.KickMembers |
      DiscordPermission.BanMembers |
      DiscordPermission.ManageMessages |
      DiscordPermission.ManageRoles |
      DiscordPermission.AddReactions}
  >
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={DiscordPermission.ModerateMembers}
      title="Timeout Users"
      description="Allows Titanium to mute and unmute members."
    />
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={DiscordPermission.KickMembers}
      title="Kick Users"
      description="Allows Titanium to kick members."
    />
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={DiscordPermission.BanMembers}
      title="Ban Users"
      description="Allows Titanium to ban and unban members."
    />
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={DiscordPermission.ManageMessages}
      title="Manage Messages"
      description="Allows Titanium to delete messages."
    />
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={DiscordPermission.ManageRoles}
      title="Manage Roles"
      description="Allows Titanium to add, remove and toggle roles."
    />
    <PermRow
      permissions={BigInt(data.serverInfo.bot_permissions)}
      required={DiscordPermission.AddReactions}
      title="Add Reactions"
      description="Allows Titanium to add reactions to messages."
    />
  </Assistant>

  <p class="text-base font-bold text-zinc-300/60">Settings</p>

  <ToggleRow bind:toggled={dataState.pageSettings.show_outcome_message}>
    <div>
      <h2 class="text-xl font-bold">Send Outcome Message</h2>
      <p>
        If automod is triggered for a message, send a message in the message channel that shows successful and failed
        actions.
      </p>
    </div>
  </ToggleRow>

  <AnchorRow href="/guild/{dataState.serverInfo.id}/logging#titanium" Icon={ChevronRight} title="Configure Logs">
    <div class="flex h-full items-center gap-4">
      <div class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-600 xs:flex">
        <ScrollText size={28} />
      </div>
      <div>
        <h2 class="text-xl font-bold">Log Channel</h2>
        <p>Go to the Titanium category on the logging page to add a channel for automod logs.</p>
      </div>
    </div>
  </AnchorRow>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Global Ignored Roles & Channels</p>

  <Row>
    <h2 class="text-xl font-bold">Global Blocked Channels</h2>
    <p class="mb-2">Select up to 100 channels that all automod rules will ignore.</p>

    <div class="flex flex-wrap gap-2">
      {#if dataState.pageSettings.global_ignored_channels.length < 100}
        <Button smallPadding={true} onclick={() => (channelOverlayOpen = true)}
          ><Plus size={20} /> Add channels...</Button
        >
      {/if}

      {#each dataState.pageSettings.global_ignored_channels as channel (channel)}
        <ChannelTile
          {channel}
          categories={data.serverInfo.categories}
          deleteThis={() => {
            dataState.pageSettings.global_ignored_channels = dataState.pageSettings.global_ignored_channels.filter(
              (c) => c !== channel
            );
          }}
        />
      {/each}
    </div>
  </Row>

  <Row>
    <h2 class="text-xl font-bold">Global Blocked Roles</h2>
    <p class="mb-2">
      Select up to 100 roles that that all automod rules will ignore messages from. Administrators are ignored by
      default.
    </p>

    <div class="flex flex-wrap gap-2">
      {#if dataState.pageSettings.global_ignored_roles.length < 100}
        <Button smallPadding={true} onclick={() => (roleOverlayOpen = true)}><Plus size={20} /> Add roles...</Button>
      {/if}

      {#each dataState.pageSettings.global_ignored_roles as role (role)}
        {@const foundRole = dataState.serverInfo.roles.find((r) => r.id === role)}
        {#if foundRole}
          <RoleTile
            role={foundRole}
            deleteThis={() => {
              dataState.pageSettings.global_ignored_roles = dataState.pageSettings.global_ignored_roles.filter(
                (r) => r !== role
              );
            }}
          />
        {/if}
      {/each}
    </div>
  </Row>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Rules</p>

  <div class="flex flex-wrap items-center gap-2">
    <Button
      onclick={() => {
        dataState.pageSettings.rules.push(createBlankRule(dataState.pageSettings.rules.length));
      }}
      disabled={data.serverInfo.limits.enforcing &&
        dataState.pageSettings.rules.length >= data.serverInfo.limits.automod_rules}
    >
      <Plus size={20} />
      Add Rule
    </Button>

    {#if data.serverInfo.limits.enforcing}
      <LimitPill amount={dataState.pageSettings.rules.length} limit={data.serverInfo.limits.automod_rules} />
    {/if}
  </div>

  <Tip>
    Rules run in the order they are in below. Use the drag handle in the top left of each rule to change the running
    order.
  </Tip>

  <section
    use:dragHandleZone={{
      items: dataState.pageSettings.rules,
      flipDurationMs
    }}
    onconsider={handleSort}
    onfinalize={handleSort}
    class="flex flex-col gap-4"
  >
    {#each dataState.pageSettings.rules as rule, index (`${rule.id}-${getShadowMarker(rule) ?? ''}`)}
      <div animate:flip={{ duration: flipDurationMs }} data-is-dnd-shadow-item-hint={getShadowMarker(rule)}>
        <Rule
          serverInfo={dataState.serverInfo}
          limit={data.serverInfo.limits.bad_word_list_size}
          enforcingLimit={data.serverInfo.limits.enforcing}
          bind:rule={dataState.pageSettings.rules[index]}
          deleteThis={() => dataState.pageSettings.rules.splice(index, 1)}
        />
      </div>
    {/each}
  </section>
</ToggledContent>
