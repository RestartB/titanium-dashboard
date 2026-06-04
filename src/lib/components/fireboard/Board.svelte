<script lang="ts">
  import { fly } from 'svelte/transition';

  import Row from '$lib/components/ui/row/Row.svelte';
  import ChannelButton from '$lib/components/ui/discord/ChannelButton.svelte';
  import EmojiPicker from '$lib/components/pickers/EmojiPicker.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import NumberInput from '$lib/components/ui/inputs/Number.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import ChannelTile from '$lib/components/ui/discord/ChannelTile.svelte';
  import RoleTile from '$lib/components/ui/discord/RoleTile.svelte';
  import { Trash, Menu } from '@lucide/svelte';

  import type { ServerInfo } from '$lib/interfaces/serverInfo';
  import type { FireboardBoardSchema } from '$lib/validators/fireboard';

  let {
    board = $bindable(),
    serverInfo,
    deleteThis
  }: {
    board: FireboardBoardSchema;
    serverInfo: ServerInfo;
    deleteThis: () => void;
  } = $props();

  let emojiPickerOpen = $state(false);
  let channelPickerOpen = $state(false);
  let rolePickerOpen = $state(false);
  let ignoredOverlayOpen = $state(false);
</script>

{#if emojiPickerOpen}
  <EmojiPicker {serverInfo} bind:overlayOpen={emojiPickerOpen} bind:selectedEmoji={board.reaction} />
{/if}

{#if channelPickerOpen}
  <ChannelPicker
    multiselect={true}
    categories={serverInfo.categories}
    bind:selectedChannels={board.ignored_channels}
    bind:overlayOpen={channelPickerOpen}
  />
{/if}

{#if rolePickerOpen}
  <RolePicker
    multiselect={true}
    roles={serverInfo.roles}
    bind:selectedRoles={board.ignored_roles}
    bind:overlayOpen={rolePickerOpen}
  />
{/if}

{#if ignoredOverlayOpen}
  <FullscreenOverlay title="Ignored Channels & Roles" padding={16} gap={16} bind:overlayOpen={ignoredOverlayOpen}>
    <div class="w-full text-left">
      <p class="font-medium">Ignored Channels</p>
      <p class="mb-2 text-sm text-zinc-400">Select up to 100 channels that this fireboard will ignore messages from.</p>

      <div class="mt-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-800 p-2">
        <Button
          class="border-2 border-zinc-600! bg-zinc-700!"
          smallPadding={true}
          onclick={() => (channelPickerOpen = true)}>Add channels...</Button
        >
        {#each board.ignored_channels as channel (channel)}
          <ChannelTile
            {channel}
            categories={serverInfo.categories}
            deleteThis={() => {
              board.ignored_channels = board.ignored_channels.filter((c) => c !== channel);
            }}
          />
        {/each}
      </div>
    </div>

    <div class="w-full text-left">
      <p class="font-medium">Ignored Roles</p>
      <p class="mb-2 text-sm text-zinc-400">Select up to 100 roles that this fireboard will ignore messages from.</p>

      <div class="mt-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-800 p-2">
        <Button
          class="border-2 border-zinc-600! bg-zinc-700!"
          smallPadding={true}
          onclick={() => (rolePickerOpen = true)}>Add roles...</Button
        >

        {#each board.ignored_roles as role (role)}
          {@const foundRole = serverInfo.roles.find((r) => r.id === role)}
          {#if foundRole}
            <RoleTile
              role={foundRole}
              deleteThis={() => {
                board.ignored_roles = board.ignored_roles.filter((r) => r !== role);
              }}
            />
          {/if}
        {/each}
      </div>
    </div>
  </FullscreenOverlay>
{/if}

<div transition:fly={{ y: -20, duration: 200 }}>
  <Row class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-2">
      <ChannelButton class="mr-auto" bind:channel={board.channel_id} categories={serverInfo.categories} />
      <button
        class="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-2 text-base transition-colors hover:bg-zinc-600 sm:p-1"
        onclick={() => (ignoredOverlayOpen = true)}
        aria-label="Delete fireboard"
      >
        <Menu size={16} class="shrink-0" />
        <p class="hidden sm:block">Ignored Channels & Roles</p>
      </button>
      <button
        class="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-red-600 bg-red-700 p-2 text-base transition-colors hover:bg-red-600 sm:p-1"
        onclick={deleteThis}
        aria-label="Delete fireboard"
      >
        <Trash size={16} class="shrink-0" />
        <p class="hidden sm:block">Delete</p>
      </button>
    </div>
    <span>
      When a message gets <NumberInput
        bind:value={board.threshold}
        min={1}
        max={99}
        class="inline-block w-10 text-center align-middle"
      />
      or more
      <button
        class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2 border-zinc-700 bg-zinc-800 text-center align-middle text-xl transition-colors hover:bg-zinc-600"
        aria-label="Select reaction"
        onclick={() => {
          emojiPickerOpen = true;
        }}
      >
        {#if isNaN(Number(board.reaction))}
          {board.reaction}
        {:else}
          {@const emojiURL = serverInfo.emojis.find((e) => e.id === board.reaction)?.url}
          {#if emojiURL}
            <img src={emojiURL} alt="Custom Emoji" class="h-6 w-6 rounded-sm" />
          {/if}
        {/if}
      </button>
      reactions, the message will be highlighted in the selected channel.
    </span>
    <div class="flex flex-col gap-2">
      <label class="inline-flex items-center gap-2 align-middle">
        <Toggle bind:toggled={board.ignore_bots} />
        <span>Ignore reactions from bots</span>
      </label>
      <label class="inline-flex items-center gap-2 align-middle">
        <Toggle bind:toggled={board.ignore_self_reactions} />
        <span>Ignore reactions from the message author</span>
      </label>
      <label class="inline-flex items-center gap-2 align-middle">
        <Toggle bind:toggled={board.send_notifications} />
        <span>Reply to user's message when it is highlighted</span>
      </label>
    </div>
  </Row>
</div>
