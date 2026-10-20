<script lang="ts">
  import { dragHandle } from 'svelte-dnd-action';
  import type { ViewComponent } from '$lib/interfaces/cv2';

  import EditComponent from './EditComponent.svelte';
  import GalleryMedia from './GalleryMedia.svelte';
  import { Cog, ExternalLink, GripVertical } from '@lucide/svelte';

  let { component = $bindable(), editMode = false }: { component: ViewComponent; editMode?: boolean } = $props();
  let editOverlayOpen = $state(false);
</script>

{#if editOverlayOpen}
  <EditComponent bind:component bind:overlayOpen={editOverlayOpen} />
{/if}

<div class="flex items-center justify-center gap-4">
  <div class="flex-1">
    {#if component.cId === 10}
      <p class="whitespace-pre-wrap" class:opacity-50={!component.content}>
        {component.content || 'No text added yet'}
      </p>
    {:else if component.cId === 9}
      <div class="flex justify-center gap-2">
        <p class="flex-1 whitespace-pre-wrap" class:opacity-50={!component.content}>
          {component.content || 'No text added yet'}
        </p>
        <span
          class="block h-22 w-22 shrink-0 rounded-lg bg-cover bg-center bg-no-repeat"
          style="background-image: url({component.url})"
        ></span>
      </div>
    {:else if component.cId === 1}
      {#if component.buttons.length === 0}
        <p class="opacity-50">No buttons added yet</p>
      {:else}
        <div class="flex flex-wrap gap-2">
          <!-- eslint-disable-next-line svelte/require-each-key -->
          {#each component.buttons as button}
            <a
              class="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-zinc-700 p-2 px-4 transition-colors hover:bg-zinc-600"
              href={button.url}
              target="_blank"
            >
              <ExternalLink />
              {button.label}
            </a>
          {/each}
        </div>
      {/if}
    {:else if component.cId === 12}
      {#if component.urls.length === 0}
        <p class="opacity-50">No media added yet</p>
      {:else}
        <div class="gallery" data-count={Math.min(component.urls.length, 4)}>
          {#each component.urls.slice(0, 4) as url, i (`${i}-${url}`)}
            <div class="gallery-item">
              <GalleryMedia src={url} />
            </div>
          {/each}
        </div>
      {/if}
    {:else if component.cId === 14}
      <hr class="border-zinc-500" class:my-6={component.spacing === 2} />
    {/if}
  </div>

  {#if editMode}
    <button
      class="shrink-0 cursor-pointer opacity-50 transition-opacity hover:opacity-100"
      title="Settings for component"
      onclick={() => (editOverlayOpen = true)}
    >
      <Cog />
    </button>

    <button class="cursor-grab touch-none text-zinc-300 active:cursor-grabbing" use:dragHandle aria-label="Drag rule">
      <GripVertical />
    </button>
  {/if}
</div>

<style>
  .gallery {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(2, 10rem);
    gap: 0.5rem;
    overflow: hidden;
    border-radius: 0.5rem;
  }

  .gallery[data-count='1'] {
    grid-template-columns: 1fr;
    grid-template-rows: 20rem;
  }

  .gallery[data-count='2'] {
    grid-template-rows: 20rem;
  }

  .gallery[data-count='3'] .gallery-item:first-child {
    grid-row: span 2;
  }

  .gallery-item {
    width: 100%;
    height: 100%;
    min-width: 0;
    object-fit: cover;
  }
</style>
