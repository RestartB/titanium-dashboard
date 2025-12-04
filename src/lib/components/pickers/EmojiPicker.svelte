<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';

  import type { Component } from 'svelte';
  import { X, Smile, UserRound, Cat, Pizza, Earth, Gamepad2, Lamp, Heart, Flag } from '@lucide/svelte';

  import emojis from 'emojibase-data/en/data.json';
  import groupsSubgroups from 'emojibase-data/en/messages.json';
  import shortcodes from 'emojibase-data/en/shortcodes/joypixels.json';

  import type { Emoji } from 'emojibase';
  import type { ServerInfo, EmojiInfo } from '$lib/interfaces/serverInfo';

  import Fuse from 'fuse.js';

  let {
    serverInfo,
    selectedEmoji = $bindable(),
    overlayOpen = $bindable(false)
  }: {
    serverInfo: ServerInfo;
    selectedEmoji?: string;
    overlayOpen?: boolean;
  } = $props();

  let searchInput = $state('');
  let hoveredEmoji: Emoji | EmojiInfo | undefined = $state();
  let emojiScrollDiv: HTMLDivElement | undefined = $state();
  let activeSection = $state('');

  for (const emoji of emojis) {
    const sc = shortcodes[emoji.hexcode];
    emoji.shortcodes = Array.isArray(sc) ? sc : sc ? [sc] : undefined;
  }

  const fuse = new Fuse(emojis, {
    keys: ['label', 'shortcodes'],
    threshold: 0.3
  });

  const customEmojiFuse = new Fuse(serverInfo.emojis, {
    keys: ['label'],
    threshold: 0.3
  });

  function getEmojiFilename(hexcode: string): string {
    const cleanHexcode = hexcode.toLowerCase().replace(/^00/, '');

    // Override for 3 dashes in hexcode
    if (cleanHexcode.split('-').length === 3) {
      return `/emojis/${cleanHexcode.replace(/fe0f-/, '')}.svg`;
    }

    // Override for eye in speech bubble
    if (cleanHexcode === '1f441-fe0f-200d-1f5e8-fe0f') {
      return `/emojis//1f441-200d-1f5e8.svg`;
    }

    return `/emojis/${cleanHexcode}.svg`;
  }

  function getFilteredEmojis(search: string | undefined = '') {
    if (!search || search.trim() === '') return emojis;
    return fuse.search(search).map((result) => result.item);
  }

  function getFilteredCustomEmojis(search: string | undefined = '') {
    if (!search || search.trim() === '') return serverInfo.emojis;
    return customEmojiFuse.search(search).map((result) => result.item);
  }

  const sectionIcons: Record<string, Component> = {
    'smileys & emotion': Smile,
    'people & body': UserRound,
    'animals & nature': Cat,
    'food & drink': Pizza,
    'travel & places': Earth,
    activities: Gamepad2,
    objects: Lamp,
    symbols: Heart,
    flags: Flag
  };

  function scrollToSection(section: string) {
    searchInput = '';
    filteredEmojis = getFilteredEmojis();

    // Wait for sections to render
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element && emojiScrollDiv) {
        // Calculate scroll position
        const containerRect = emojiScrollDiv.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop = emojiScrollDiv.scrollTop + (elementRect.top - containerRect.top);

        emojiScrollDiv.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }, 0);
  }

  function handleScroll() {
    if (!emojiScrollDiv) return;

    const containerRect = emojiScrollDiv.getBoundingClientRect();
    const scrollTop = emojiScrollDiv.scrollTop;

    for (const group of [{ message: 'custom' }, ...groupsSubgroups.groups]) {
      if (group.message === 'components') continue;

      const element = document.getElementById(group.message);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const relativeTop = elementRect.top - containerRect.top + scrollTop;

        if (relativeTop <= scrollTop + 50) {
          activeSection = group.message;
        }
      }
    }
  }

  let filteredEmojis: Emoji[] = $state(getFilteredEmojis());
  let filteredCustomEmojis: EmojiInfo[] = $state(getFilteredCustomEmojis());
</script>

{#snippet emojiJumper(section: string, ButtonIcon: Component)}
  <button
    onclick={() => scrollToSection(section)}
    class="cursor-pointer rounded-full p-1 transition-colors {activeSection === section
      ? 'bg-zinc-500'
      : 'hover:bg-zinc-600/50'}"
    aria-label="Jump to {section} section"
  >
    <ButtonIcon size={24} />
  </button>
{/snippet}

<div
  class="flex w-full max-w-104 flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
  transition:scale={{ duration: 300, easing: cubicOut, start: 0.9, opacity: 1 }}
>
  <div class="flex w-full items-center justify-between gap-2">
    <h2 class="text-xl font-bold">Select an Emoji</h2>
    <button
      class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
      onclick={() => (overlayOpen = false)}
      aria-label="Close emoji selector"
    >
      <X class="h-6 w-6" />
    </button>
  </div>
  <div class="flex h-full max-h-120 min-h-120 w-full max-w-96 flex-col rounded-xl border-2 border-zinc-600 bg-zinc-700">
    <div class="flex h-fit w-full shrink-0 flex-col gap-2 border-b-2 border-zinc-600 p-2">
      <input
        type="text"
        placeholder="Search emojis..."
        class="w-full rounded-md border-2 border-zinc-600 bg-zinc-800 p-2 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
        bind:value={searchInput}
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            filteredEmojis = getFilteredEmojis(searchInput);
            filteredCustomEmojis = getFilteredCustomEmojis(searchInput);
          }
        }}
      />

      <div class="flex items-center gap-2 overflow-x-auto">
        {#if serverInfo.emojis.length > 0}
          <button
            onclick={() => scrollToSection('custom')}
            class="flex cursor-pointer items-center justify-center p-1"
            aria-label="Jump to server emojis section"
          >
            <img
              src={serverInfo.icon.replaceAll('?size=1024', '?size=128')}
              alt={serverInfo.name}
              class="h-6 w-6 shrink-0 transition-all {activeSection === 'custom'
                ? 'rounded-full brightness-150'
                : 'rounded-lg'}"
              loading="lazy"
              decoding="async"
            />
          </button>
        {/if}
        {#each groupsSubgroups.groups as group (group.key)}
          {#if group.message !== 'components'}
            {@render emojiJumper(group.message, sectionIcons[group.message] || Smile)}
          {/if}
        {/each}
      </div>
    </div>

    <div
      class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2"
      bind:this={emojiScrollDiv}
      onscroll={handleScroll}
    >
      {#if filteredCustomEmojis.length > 0}
        <div class="flex items-center justify-center gap-2" id="custom">
          <img
            src={serverInfo.icon.replaceAll('?size=1024', '?size=128')}
            alt={serverInfo.name}
            class="h-6 w-6 rounded-lg"
            loading="lazy"
            decoding="async"
          />
          <h3 class="text-md font-semibold capitalize">{serverInfo.name}</h3>
        </div>
        <div class="grid grid-cols-7 place-items-center gap-2">
          {#each filteredCustomEmojis as emoji (emoji.id)}
            <button
              onclick={() => {
                selectedEmoji = emoji.id;
                overlayOpen = false;
              }}
              aria-label={emoji.label}
              class="cursor-pointer"
            >
              <img
                src={emoji.url}
                alt={emoji.label}
                class="h-8 w-8"
                loading="lazy"
                decoding="async"
                onmouseover={() => (hoveredEmoji = emoji)}
                onfocus={() => (hoveredEmoji = emoji)}
              />
            </button>
          {/each}
        </div>
      {/if}
      {#each groupsSubgroups.groups as group (group.key)}
        {@const groupEmojis = filteredEmojis.filter((emoji) => emoji.group === group.order)}
        {#if groupEmojis.length > 0 && group.message !== 'components'}
          {@const IconComponent = sectionIcons[group.message]}
          <div class="flex items-center justify-center gap-2" id={group.message}>
            {#if IconComponent}
              <IconComponent size={24} />
            {/if}
            <h3 class="text-md font-semibold capitalize">{group.message}</h3>
          </div>
          <div class="grid grid-cols-7 place-items-center gap-2">
            {#each groupEmojis as emoji (emoji.hexcode)}
              <button
                onclick={() => {
                  selectedEmoji = emoji.emoji;
                  overlayOpen = false;
                }}
                aria-label={emoji.label}
                class="cursor-pointer"
              >
                <img
                  src={getEmojiFilename(emoji.hexcode)}
                  alt={emoji.label}
                  class="h-8 w-8"
                  loading="lazy"
                  decoding="async"
                  onmouseover={() => (hoveredEmoji = emoji)}
                  onfocus={() => (hoveredEmoji = emoji)}
                />
              </button>
            {/each}
          </div>
        {/if}
      {/each}
    </div>

    <div class="flex h-16 shrink-0 items-center gap-2 overflow-hidden border-t-2 border-zinc-500 p-2">
      {#if hoveredEmoji}
        {#if 'hexcode' in hoveredEmoji}
          <img
            src={getEmojiFilename(hoveredEmoji.hexcode)}
            alt={hoveredEmoji.label}
            class="h-8 w-8"
            loading="lazy"
            decoding="async"
          />
        {:else if 'url' in hoveredEmoji}
          <img src={hoveredEmoji.url} alt={hoveredEmoji.label} class="h-8 w-8" loading="lazy" decoding="async" />
        {/if}
        <div class="max-w-full overflow-hidden">
          {#if 'shortcodes' in hoveredEmoji}
            <p class="w-full truncate font-medium">{hoveredEmoji.label}</p>
            <p class="w-full truncate text-sm text-zinc-400">
              :{hoveredEmoji.shortcodes?.join(': :')}:
            </p>
          {:else}
            <p class="w-full truncate font-medium">
              :{hoveredEmoji.label}:
            </p>
          {/if}
        </div>
      {:else}
        <p class="text-zinc-400">Hover over an emoji to see details</p>
      {/if}
    </div>
  </div>
</div>
