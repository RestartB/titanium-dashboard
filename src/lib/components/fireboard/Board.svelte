<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import ChannelButton from '$lib/components/ui/discord/ChannelButton.svelte';
  import EmojiPicker from '$lib/components/pickers/EmojiPicker.svelte';
  import Toggle from '$lib/components/ui/Toggle.svelte';
  import { Trash } from '@lucide/svelte';

  import type { ServerInfo } from '$lib/types/serverInfo';
  import type { FireboardBoard } from '$lib/types/fireboard';

  let {
    board = $bindable(),
    serverInfo,
    deleteThis
  }: {
    board: FireboardBoard;
    serverInfo: ServerInfo;
    deleteThis: () => void;
  } = $props();

  let emojiPickerOpen = $state(false);

  $effect(() => {
    if (String(board.threshold).trim() === '') {
      return;
    }

    const numValue = Number(board.threshold);
    if (isNaN(numValue)) {
      board.threshold = 5;
      return;
    }
    if (numValue < 1) {
      board.threshold = 1;
    }
  });
</script>

{#if emojiPickerOpen}
  <FullscreenOverlay bind:overlayOpen={emojiPickerOpen}>
    <EmojiPicker
      {serverInfo}
      bind:overlayOpen={emojiPickerOpen}
      bind:selectedEmoji={board.reaction}
    />
  </FullscreenOverlay>
{/if}

<Row class="flex flex-col gap-2">
  <div class="flex items-center justify-between gap-2">
    <ChannelButton
      bind:channel={board.channel_id}
      categories={serverInfo.categories}
      class="bg-zinc-700"
    />
    <button
      class="flex flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-red-600 bg-red-700 p-2 text-base transition-colors hover:bg-red-600 xs:p-1"
      onclick={deleteThis}
      aria-label="Delete fireboard"
    >
      <Trash size={16} class="flex-shrink-0" />
      <p class="hidden xs:block">Delete</p>
    </button>
  </div>
  <span>
    When a message gets <input
      type="text"
      class="inline w-10 rounded-lg border-2 border-zinc-700 bg-zinc-800 p-1 text-center font-mono"
      bind:value={board.threshold}
      onfocusout={() => {
        if (String(board.threshold).trim() === '') {
          board.threshold = 5;
        }
      }}
    />
    or more
    <button
      class="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-zinc-700 bg-zinc-800 text-center text-xl"
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
    <label class="inline-flex items-center gap-2">
      <Toggle bind:toggled={board.ignore_bots} />
      <span>Ignore reactions from bots</span>
    </label>
    <label class="inline-flex items-center gap-2">
      <Toggle bind:toggled={board.ignore_self_reactions} />
      <span>Ignore reactions from the message author</span>
    </label>
  </div>
</Row>
