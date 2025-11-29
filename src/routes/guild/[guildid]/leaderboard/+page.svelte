<script lang="ts">
  import { ToggleRow, Row } from '$lib/components/ui/row';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import Radio from '$lib/components/ui/inputs/Radio.svelte';
  import NumberInput from '$lib/components/ui/inputs/Number.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import Level from '$lib/components/leaderboard/Level.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';

  import ChannelButton from '$lib/components/ui/discord/ChannelButton.svelte';

  import { Dice6, Star, Brain, Plus } from '@lucide/svelte';

  const { data } = $props();
  let dataState = $state(data);

  const sortedLevels = $derived([...dataState.pageSettings.levels].sort((a, b) => a.xp_required - b.xp_required));
</script>

<Saver page="leaderboard" {data} bind:dataState />

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
          name="mode"
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
          name="mode"
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
          name="mode"
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
        <p>Enter the minimum amount of XP users can receive for each message they send in the server.</p>
      </div>
      <NumberInput bind:value={dataState.pageSettings.min_xp} min={1} class="mt-2" />
    </Row>
    <Row>
      <div>
        <h2 class="text-xl font-bold">Maximum XP</h2>
        <p>Enter the maximum amount of XP users can receive for each message they send in the server.</p>
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
      <NumberInput bind:value={dataState.pageSettings.xp_mult} min={0} max={10} integer={false} class="mt-2" />
    </Row>
  {/if}

  <Row>
    <div>
      <h2 class="text-xl font-bold">Cooldown</h2>
      <p>Enter the amount of time (in seconds) users must wait before they can earn XP again.</p>
    </div>
    <NumberInput bind:value={dataState.pageSettings.cooldown} min={0} max={600} class="mt-2" />
  </Row>

  <hr class=" border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Levels</p>

  <Button
    onclick={() => {
      dataState.pageSettings.levels.push({ xp_required: 1000, reward_roles: [] });
    }}
  >
    <Plus size={20} />
    Add Level
  </Button>

  {#each sortedLevels as level, i}
    <Level
      bind:level={dataState.pageSettings.levels[dataState.pageSettings.levels.indexOf(level)]}
      id={i + 1}
      deleteLevel={() => {
        dataState.pageSettings.levels.splice(dataState.pageSettings.levels.indexOf(level), 1);
      }}
    />
  {/each}

  <hr class=" border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Old Members</p>

  <ToggleRow bind:toggled={dataState.pageSettings.levelup_notifications}>
    <div>
      <h2 class="text-xl font-bold">Delete XP for leavers</h2>
      <p>
        When a member leaves the server, their XP will be deleted. This keeps the leaderboard clean, but means that
        users who join back will have their XP reset.
      </p>
    </div>
  </ToggleRow>

  <hr class=" border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Notifications</p>

  <ToggleRow bind:toggled={dataState.pageSettings.levelup_notifications}>
    <div>
      <h2 class="text-xl font-bold">Level Up Notifications</h2>
      <p>Titanium will send a message when a user levels up, letting them know about their new level.</p>
    </div>
  </ToggleRow>

  <ToggledContent bind:enabled={dataState.pageSettings.levelup_notifications}>
    <Row>
      <div>
        <h2 class="text-xl font-bold">Notification Channel</h2>
        <p>
          You can optionally set a channel where Titanium will send level up notifications. If this is left blank, the
          notifications will be sent to the current channel.
        </p>
      </div>

      <ChannelButton
        categories={data.serverInfo.categories}
        bind:channel={dataState.pageSettings.notification_channel}
        class="mt-2 bg-zinc-700"
      />
    </Row>
  </ToggledContent>

  <hr class=" border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Web Leaderboard</p>

  <Alert>
    <p>Coming soon</p>
  </Alert>

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
