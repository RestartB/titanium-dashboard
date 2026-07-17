<script lang="ts">
  import { page } from '$app/state';

  import { ToggleRow, ButtonRow, Row } from '$lib/components/ui/row';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import Radio from '$lib/components/ui/inputs/Radio.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import NumberInput from '$lib/components/ui/inputs/Number.svelte';
  import ChannelButton from '$lib/components/ui/discord/ChannelButton.svelte';
  import ChannelTile from '$lib/components/ui/discord/ChannelTile.svelte';
  import RoleTile from '$lib/components/ui/discord/RoleTile.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';

  import Saver from '$lib/components/Saver.svelte';
  import Level from '$lib/components/leaderboard/Level.svelte';
  import LimitPill from '$lib/components/ui/LimitPill.svelte';

  import { Dice6, Star, Brain, Plus, X, Copy, Check } from '@lucide/svelte';

  const { data } = $props();
  let dataState = $state(data);

  let channelOverlayOpen = $state(false);
  let roleOverlayOpen = $state(false);

  const sortedLevels = $derived([...dataState.pageSettings.levels].sort((a, b) => a.xp_required - b.xp_required));
  const sortedLevelsDecending = $derived(
    [...dataState.pageSettings.levels].sort((a, b) => b.xp_required - a.xp_required)
  );

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

<Saver page="leaderboard" {data} bind:dataState />

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
    <h2 class="text-4xl font-bold">Leaderboard</h2>
    <p>Track engagement and activity in your server, and give rewards.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.leaderboard} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.leaderboard}>
  <p class="text-base font-bold text-zinc-300/60">XP Settings</p>
  <div class="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
    <Row>
      <div class="flex h-full items-center justify-between sm:flex-col">
        <div>
          <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-600">
            <Star size={28} />
          </div>
          <h2 class="text-xl font-bold">Fixed XP</h2>
          <p>Give a fixed amount of XP to users for each message.</p>
        </div>
        <Radio
          name="xp-mode"
          value="fixed"
          toggled={dataState.pageSettings.mode === 'fixed'}
          class="sm:mx-auto sm:mt-2"
          bind:group={dataState.pageSettings.mode}
        />
      </div>
    </Row>

    <Row>
      <div class="flex h-full items-center justify-between sm:flex-col">
        <div>
          <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-600">
            <Dice6 size={28} />
          </div>
          <h2 class="text-xl font-bold">Random XP</h2>
          <p>Give a random amount of XP to users for each message.</p>
        </div>
        <Radio
          name="xp-mode"
          value="random"
          toggled={dataState.pageSettings.mode === 'random'}
          class="sm:mx-auto sm:mt-2"
          bind:group={dataState.pageSettings.mode}
        />
      </div>
    </Row>

    <Row>
      <div class="flex h-full items-center justify-between sm:flex-col">
        <div>
          <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-600">
            <Brain size={28} />
          </div>
          <h2 class="text-xl font-bold">Dynamic XP</h2>
          <p>Give a dynamic amount of XP to users, based on the length of their message and a multiplier.</p>
        </div>
        <Radio
          name="xp-mode"
          value="length"
          toggled={dataState.pageSettings.mode === 'length'}
          class="sm:mx-auto sm:mt-2"
          bind:group={dataState.pageSettings.mode}
        />
      </div>
    </Row>
  </div>

  {#if dataState.pageSettings.mode === 'fixed'}
    <Row>
      <div>
        <h2 class="text-xl font-bold">XP</h2>
        <p>Enter the amount of XP users will receive for each message they send in the server.</p>
      </div>
      <NumberInput bind:value={dataState.pageSettings.base_xp} min={1} class="mt-2" />
    </Row>
  {:else if dataState.pageSettings.mode === 'random'}
    <Row>
      <div>
        <h2 class="text-xl font-bold">Minimum XP</h2>
        <p>Enter the minimum amount of XP that users can receive for each message they send in the server.</p>
      </div>
      <NumberInput bind:value={dataState.pageSettings.min_xp} min={1} class="mt-2" />
    </Row>
    <Row>
      <div>
        <h2 class="text-xl font-bold">Maximum XP</h2>
        <p>Enter the maximum amount of XP that users can receive for each message they send in the server.</p>
      </div>
      <NumberInput bind:value={dataState.pageSettings.max_xp} min={1} class="mt-2" />
    </Row>
  {:else if dataState.pageSettings.mode === 'length'}
    <Row>
      <div>
        <h2 class="text-xl font-bold">XP Multiplier</h2>
        <p>
          Enter the multiplier that will be applied to determine the amount of XP users receive based on the length of
          their message.
        </p>
      </div>
      <NumberInput bind:value={dataState.pageSettings.xp_mult} min={0.1} max={10} integer={false} class="mt-2" />
    </Row>

    <Row>
      <div>
        <h2 class="text-xl font-bold">Minimum XP</h2>
        <p>Enter the minimum amount of XP that users can receive per message, regardless of length.</p>
      </div>
      <NumberInput bind:value={dataState.pageSettings.min_xp} min={1} class="mt-2" />
    </Row>

    <Row>
      <div>
        <h2 class="text-xl font-bold">Maximum XP</h2>
        <p>Enter the maximum amount of XP that users can receive per message, regardless of length.</p>
      </div>
      <NumberInput bind:value={dataState.pageSettings.max_xp} min={1} class="mt-2" />
    </Row>
  {/if}

  <Row>
    <div>
      <h2 class="text-xl font-bold">Cooldown</h2>
      <p>Enter the amount of time (in seconds) users must wait before they can earn XP again.</p>
    </div>
    <NumberInput bind:value={dataState.pageSettings.cooldown} min={0} max={600} class="mt-2" />
  </Row>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">VC Tracking</p>

  <ToggleRow bind:toggled={dataState.pageSettings.vc_enabled}>
    <div>
      <h2 class="text-xl font-bold">VC Tracking</h2>
      <p>
        When this option is enabled, Titanium will add XP to your members when they are in VC. Note that XP will only be
        added when Titanium is online.
      </p>
    </div>
  </ToggleRow>

  <ToggledContent bind:enabled={dataState.pageSettings.vc_enabled}>
    <div class="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
      <Row>
        <div class="flex h-full items-center justify-between sm:flex-col">
          <div>
            <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-600">
              <Star size={28} />
            </div>
            <h2 class="text-xl font-bold">Fixed XP</h2>
            <p>Give a fixed amount of XP to users for each VC minute.</p>
          </div>
          <Radio
            name="vc-mode"
            value="fixed"
            toggled={dataState.pageSettings.vc_mode === 'fixed'}
            class="sm:mx-auto sm:mt-2"
            bind:group={dataState.pageSettings.vc_mode}
          />
        </div>
      </Row>

      <Row>
        <div class="flex h-full items-center justify-between sm:flex-col">
          <div>
            <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-600">
              <Dice6 size={28} />
            </div>
            <h2 class="text-xl font-bold">Random XP</h2>
            <p>Give a random amount of XP to users for each VC minute.</p>
          </div>
          <Radio
            name="vc-mode"
            value="random"
            toggled={dataState.pageSettings.vc_mode === 'random'}
            class="sm:mx-auto sm:mt-2"
            bind:group={dataState.pageSettings.vc_mode}
          />
        </div>
      </Row>
    </div>

    {#if dataState.pageSettings.vc_mode === 'fixed'}
      <Row>
        <div>
          <h2 class="text-xl font-bold">XP</h2>
          <p>Enter the amount of XP users will receive for each minute they are in VC.</p>
        </div>
        <NumberInput bind:value={dataState.pageSettings.vc_base_xp} min={1} class="mt-2" />
      </Row>
    {:else}
      <Row>
        <div>
          <h2 class="text-xl font-bold">Minimum XP</h2>
          <p>Enter the minimum amount of XP that users can receive for each minute they are in VC.</p>
        </div>
        <NumberInput bind:value={dataState.pageSettings.vc_min_xp} min={1} class="mt-2" />
      </Row>
      <Row>
        <div>
          <h2 class="text-xl font-bold">Maximum XP</h2>
          <p>Enter the maximum amount of XP that users can receive for each minute they are in VC.</p>
        </div>
        <NumberInput bind:value={dataState.pageSettings.vc_max_xp} min={1} class="mt-2" />
      </Row>
    {/if}

    <Row>
      <div>
        <h2 class="text-xl font-bold">Time Delay</h2>
        <p>Enter the amount of minutes that the user needs to be in VC for, before they start earning XP.</p>
      </div>
      <NumberInput bind:value={dataState.pageSettings.vc_delay} min={0} max={1440} class="mt-2" />
    </Row>
  </ToggledContent>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Ignored Roles & Channels</p>

  <Row>
    <h2 class="text-xl font-bold">Blocked Channels</h2>
    <p class="mb-2">Select up to 100 channels where XP cannot be earned.</p>

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

  <Row>
    <h2 class="text-xl font-bold">Blocked Roles</h2>
    <p class="mb-2">Select up to 100 roles that cannot earn XP.</p>

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
  <p class="text-base font-bold text-zinc-300/60">Bot Tracking</p>

  <ToggleRow bind:toggled={dataState.pageSettings.bot_message_tracking}>
    <div>
      <h2 class="text-xl font-bold">Bot Message Tracking</h2>
      <p>With this option enabled, Titanium will monitor messages from bots to update the message counters.</p>
    </div>
  </ToggleRow>

  <ToggledContent enabled={dataState.pageSettings.bot_message_tracking}>
    <ToggleRow bind:toggled={dataState.pageSettings.bot_message_xp}>
      <div>
        <h2 class="text-xl font-bold">Bot Message XP</h2>
        <p>
          With this option enabled, Titanium will award XP to bots based on their messages. The
          <b>"Bot Message Tracking"</b> option must be enabled.
        </p>
      </div>
    </ToggleRow>
  </ToggledContent>

  <ToggleRow bind:toggled={dataState.pageSettings.bot_vc_tracking}>
    <div>
      <h2 class="text-xl font-bold">Bot VC Tracking</h2>
      <p>With this option enabled, Titanium will monitor bots for their VC time to update the VC time counters.</p>
    </div>
  </ToggleRow>

  <ToggledContent enabled={dataState.pageSettings.bot_vc_tracking}>
    <ToggleRow bind:toggled={dataState.pageSettings.bot_vc_xp}>
      <div>
        <h2 class="text-xl font-bold">Bot VC XP</h2>
        <p>
          With this option enabled, Titanium will award XP to bots based on their VC time. The
          <b>"Bot VC Tracking"</b> option must be enabled.
        </p>
      </div>
    </ToggleRow>
  </ToggledContent>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Levels</p>

  <ToggleRow bind:toggled={dataState.pageSettings.stack_roles}>
    <div>
      <h2 class="text-xl font-bold">Stack Roles</h2>
      <p>
        When a user levels up, stack previous level roles on top of the current level's roles. With this disabled, roles
        from previous levels will be removed / not granted.
      </p>
    </div>
  </ToggleRow>

  <Button
    onclick={() => {
      dataState.pageSettings.levels.push({
        id: crypto.randomUUID(),
        xp_required: dataState.pageSettings.levels.length > 0 ? sortedLevelsDecending[0].xp_required + 1000 : 1000,
        reward_roles: []
      });
    }}
    disabled={data.serverInfo.limits.enforcing &&
      dataState.pageSettings.levels.length >= data.serverInfo.limits.leaderboard_levels}
  >
    <Plus size={20} />
    Add Level
  </Button>

  {#if data.serverInfo.limits.enforcing}
    <LimitPill amount={dataState.pageSettings.levels.length} limit={data.serverInfo.limits.leaderboard_levels} />
  {/if}

  {#each sortedLevels as level, i (level.id)}
    <Level
      bind:level={dataState.pageSettings.levels[i]}
      id={i + 1}
      serverInfo={data.serverInfo}
      deleteLevel={() => {
        dataState.pageSettings.levels.splice(i, 1);
      }}
    />
  {/each}

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Old Members</p>

  <ToggleRow bind:toggled={dataState.pageSettings.delete_leavers}>
    <div>
      <h2 class="text-xl font-bold">Delete XP for leavers</h2>
      <p>
        When a member leaves the server and Titanium is online, their XP will be deleted. This keeps the leaderboard
        clean, but means that users who join back will have their XP reset.
      </p>
    </div>
  </ToggleRow>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Notifications</p>

  <ToggleRow bind:toggled={dataState.pageSettings.levelup_notifications}>
    <div>
      <h2 class="text-xl font-bold">Level Up Notifications</h2>
      <p>Titanium will send a message when a user levels up, letting them know about their new level.</p>
    </div>
  </ToggleRow>

  <ToggledContent bind:enabled={dataState.pageSettings.levelup_notifications}>
    <ToggleRow bind:toggled={dataState.pageSettings.notification_ping}>
      <div>
        <h2 class="text-xl font-bold">Notification Pings</h2>
        <p>Whether to ping the user when sending a level up notification.</p>
      </div>
    </ToggleRow>

    <Row>
      <div>
        <h2 class="text-xl font-bold">Notification Channel</h2>
        <p>
          You can optionally set a channel where Titanium will send level up notifications. If this is left blank, the
          notifications will be sent to the current channel.
        </p>
      </div>

      <div class="mt-2 flex flex-wrap gap-2">
        <ChannelButton
          categories={data.serverInfo.categories}
          bind:channel={dataState.pageSettings.notification_channel}
          class="bg-zinc-700"
        />

        {#if dataState.pageSettings.notification_channel}
          <Button onclick={() => (dataState.pageSettings.notification_channel = null)} smallPadding={true}><X /></Button
          >
        {/if}
      </div>
    </Row>
  </ToggledContent>

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
      <p class="truncate">{page.url.origin}/public/lb/{data.serverInfo.id}</p>
    </ButtonRow>
  {/if}

  <ToggleRow bind:toggled={dataState.pageSettings.web_leaderboard_enabled}>
    <div>
      <h2 class="text-xl font-bold">Web Leaderboard</h2>
      <p>
        Allow users to view the leaderboard from their web browser. This has more features and a nicer UI than the
        Discord command version.
      </p>
    </div>
  </ToggleRow>

  <ToggledContent bind:enabled={dataState.pageSettings.web_leaderboard_enabled}>
    <ToggleRow bind:toggled={dataState.pageSettings.web_login_required}>
      <div>
        <h2 class="text-xl font-bold">Require Discord Login</h2>
        <p>
          Users will have to log in with their Discord account before viewing the web leaderboard, to verify that they
          are in the server.
        </p>
      </div>
    </ToggleRow>
  </ToggledContent>
</ToggledContent>
