<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import Fuse from 'fuse.js';
  import type { TagsId } from '$lib/interfaces/tags';

  let {
    tags,
    // eslint-disable-next-line no-useless-assignment
    selectedTag = $bindable(),
    onSelect = () => {},
    overlayOpen = $bindable(false)
  }: {
    tags: TagsId[];
    selectedTag?: string | undefined;
    onSelect?: (tag: string) => void;
    overlayOpen?: boolean;
  } = $props();

  let searchInput = $state('');

  const fuse = $derived(
    new Fuse(tags, {
      keys: ['name'],
      threshold: 0.3
    })
  );

  function getFilteredRoles(query: string): TagsId[] {
    if (!query) return tags;

    const lowercasedQuery = query.toLowerCase();
    return fuse.search(lowercasedQuery).map((result) => result.item);
  }

  let filteredTags = $derived(getFilteredRoles(searchInput));
</script>

<FullscreenOverlay bind:overlayOpen title="Select a Tag" zIndex={60}>
  <div class="flex h-fit w-full shrink-0 flex-col gap-2 border-b-2 border-zinc-600 p-2">
    <input
      type="text"
      placeholder="Search tags..."
      class="w-full rounded-md border-2 border-zinc-600 bg-zinc-800 p-2 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
      bind:value={searchInput}
    />
  </div>

  <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
    {#if filteredTags.length === 0}
      <div class="flex flex-col items-center justify-center text-zinc-400 p-4">
        <p class="text-lg">No tags found</p>
      </div>
    {:else}
      {#each filteredTags as tag (tag.id)}
        <button
          class="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-zinc-800 p-1 px-2 transition-colors hover:bg-zinc-600"
          type="button"
          onclick={() => {
            onSelect(tag.id);
            selectedTag = tag.id;
            overlayOpen = false;
          }}
        >
          <p>{tag.name}</p>
        </button>
      {/each}
    {/if}
  </div>
</FullscreenOverlay>
