<script lang="ts">
  import { onMount } from 'svelte';
  import { slide, fade } from 'svelte/transition';

  import { getGifCategories, getTrendingGifs, searchGifs } from '$lib/remote/gifs.remote';

  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import { ChevronLeft, TrendingUp } from '@lucide/svelte';

  import type { RemoteQuery } from '@sveltejs/kit';
  import type { GifResults, GifCategoriesResult } from '$lib/interfaces/gif';

  let {
    // eslint-disable-next-line no-useless-assignment
    selectedGif = $bindable(),
    onSelect = () => {},
    overlayOpen = $bindable(false)
  }: {
    selectedGif?: string | null;
    onSelect?: (gif: string) => void;
    overlayOpen?: boolean;
  } = $props();

  let searchInput = $state('');
  let debouncedInput = $state('');
  let currentCategory = $state('');

  let categoryQuery: RemoteQuery<GifCategoriesResult> | undefined = $state();
  let resultsQuery: RemoteQuery<GifResults> | undefined = $state();

  onMount(async () => {
    categoryQuery = getGifCategories({ region: navigator.language });
  });

  $effect(() => {
    const currentInput = searchInput;

    const id = setTimeout(() => {
      debouncedInput = currentInput;
    }, 300);

    return () => {
      clearTimeout(id);
    };
  });

  $effect(() => {
    if (!searchInput && currentCategory === 'search') {
      currentCategory = '';
      resultsQuery = undefined;
      return;
    }

    if (currentCategory === 'trending') {
      resultsQuery = getTrendingGifs({ page: 1, region: navigator.language });
    } else if (currentCategory === 'search') {
      if (debouncedInput) {
        if (searchInput === debouncedInput) {
          resultsQuery = searchGifs({ query: debouncedInput, page: 1, region: navigator.language });
        }
      } else {
        resultsQuery = undefined;
      }
    }
  });
</script>

<FullscreenOverlay bind:overlayOpen title="Insert a GIF" zIndex={60} overflow={false}>
  <div class="flex h-fit w-full shrink-0 border-b-2 border-zinc-600">
    {#if currentCategory}
      <div transition:slide={{ axis: 'x', duration: 400 }} class="m-2 mr-0 flex shrink-0">
        <button
          transition:fade={{ duration: 200 }}
          class="flex h-full w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-zinc-600 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
          type="button"
          onclick={() => {
            currentCategory = '';
            searchInput = '';
            resultsQuery = undefined;
          }}
        >
          <ChevronLeft class="shrink-0" />
        </button>
      </div>
    {/if}

    <input
      type="text"
      placeholder="Search GIFs on Klipy..."
      class="m-2 w-full rounded-md border-2 border-zinc-600 bg-zinc-800 p-2 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
      oninput={() => (currentCategory = 'search')}
      bind:value={searchInput}
    />
  </div>

  <div
    class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2"
    class:overflow-y-auto={(categoryQuery && !categoryQuery.loading) || (resultsQuery && !resultsQuery.loading)}
    class:overflow-none={!categoryQuery || categoryQuery.loading || !resultsQuery || resultsQuery.loading}
  >
    {#if currentCategory === 'trending' || currentCategory === 'search' || searchInput}
      {#if resultsQuery && !resultsQuery.loading && resultsQuery.current?.data.data.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-zinc-400">
          <p class="text-lg">No GIFs found</p>
        </div>
      {:else if resultsQuery && resultsQuery.error}
        <div class="flex flex-col items-center justify-center py-12 text-zinc-400">
          <p class="text-lg">An error occurred</p>
        </div>
      {:else}
        <div class="columns-2 gap-4">
          {#if !resultsQuery || resultsQuery.loading}
            {#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
              <div
                class="mb-4 flex h-30 w-full animate-pulse items-center justify-center gap-2 rounded-lg bg-zinc-600"
              ></div>
            {/each}
          {:else}
            {#each resultsQuery.current?.data.data as gif (gif.id)}
              <button
                title={gif.title}
                class="mb-4 block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-lg"
                type="button"
                onclick={() => {
                  selectedGif = gif.file.hd.webp.url;
                  onSelect(selectedGif);
                  overlayOpen = false;
                }}
              >
                <img
                  src={gif.file.md.webp.url}
                  alt={gif.title}
                  height={gif.file.md.webp.height}
                  class="block h-auto w-full"
                  loading="lazy"
                  decoding="async"
                  style:background-image="url({gif.blur_preview})"
                  style:background-size="cover"
                  style:background-position="center"
                  style:aspect-ratio="{gif.file.md.webp.width} / {gif.file.md.webp.height}"
                  style:color="transparent"
                />
              </button>
            {/each}
          {/if}
        </div>
      {/if}
    {:else if categoryQuery && categoryQuery.error}
      <div class="flex flex-col items-center justify-center py-12 text-zinc-400">
        <p class="text-lg">An error occurred</p>
      </div>
    {:else}
      <div class="grid grid-cols-2 gap-4">
        {#if !categoryQuery || categoryQuery.loading || categoryQuery.error || categoryQuery.current?.data.categories.length === 0}
          {#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
            <div class="flex h-30 w-full animate-pulse items-center justify-center gap-2 rounded-lg bg-zinc-600"></div>
          {/each}
        {:else}
          <button
            class="flex h-30 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-br from-zinc-800 to-zinc-900 text-xl font-bold"
            type="button"
            onclick={() => {
              searchInput = '';
              debouncedInput = '';
              currentCategory = 'trending';
            }}
          >
            <TrendingUp />
            Trending
          </button>

          {#each categoryQuery.current?.data.categories as category (category.query)}
            <button
              class="group relative isolate h-30 w-full cursor-pointer overflow-hidden rounded-lg"
              type="button"
              onclick={() => {
                searchInput = category.query;
                debouncedInput = category.query;
                currentCategory = 'search';
              }}
            >
              <p class="absolute top-0 left-0 z-20 flex h-full w-full items-center justify-center text-xl font-bold">
                {category.category}
              </p>
              <div class="absolute top-0 left-0 z-10 h-full w-full bg-black/60"></div>
              <div
                class="absolute top-0 left-0 h-full w-full transition-all group-hover:blur-sm"
                style:background-image="url({category.preview_url})"
                style:background-size="cover"
                style:background-position="center"
              ></div>
            </button>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
</FullscreenOverlay>
