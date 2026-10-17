<script lang="ts">
  import { flip } from 'svelte/animate';
  import { dragHandleZone, SHADOW_ITEM_MARKER_PROPERTY_NAME, type DndEvent } from 'svelte-dnd-action';

  import FullscreenOverlay from '../ui/FullscreenOverlay.svelte';
  import Button from '../ui/inputs/Button.svelte';
  import PreviewComponent from './PreviewComponent.svelte';
  import { Plus } from '@lucide/svelte';

  import { cv2Components } from '$lib/helpers/discord';
  import type { ViewComponent } from '$lib/interfaces/cv2';

  let { view = $bindable() }: { view: ViewComponent[] } = $props();

  type DndComponent = ViewComponent & Partial<Record<typeof SHADOW_ITEM_MARKER_PROPERTY_NAME, boolean>>;
  const flipDurationMs = 300;

  let addOverlayOpen = $state(false);

  function handleSort(e: CustomEvent<DndEvent<ViewComponent>>) {
    view = e.detail.items.map((rule, order) => ({
      ...rule,
      order
    }));
  }
  function getShadowMarker(rule: ViewComponent) {
    return (rule as DndComponent)[SHADOW_ITEM_MARKER_PROPERTY_NAME];
  }
</script>

{#if addOverlayOpen}
  <FullscreenOverlay title="Add Component" padding={8} gap={8} zIndex={60} bind:overlayOpen={addOverlayOpen}>
    {#each Object.values(cv2Components) as c (c.cId)}
      {@const Icon = c.Icon}
      <button
        class="flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 px-4 transition-all hover:bg-zinc-800"
        aria-label="Select {c.title} component"
        onclick={() => {
          let newComponent = { ...c };
          newComponent.id = crypto.randomUUID();
          view.push(newComponent);

          addOverlayOpen = false;
        }}
      >
        <Icon size={24} />
        <div class="w-full text-left">
          <p class="font-medium">{c.title}</p>
          <p class="text-sm text-zinc-400">{c.description}</p>
        </div>
      </button>
    {/each}
  </FullscreenOverlay>
{/if}

<Button class="border-zinc-600! bg-zinc-800!" onclick={() => (addOverlayOpen = true)}><Plus /> Add component</Button>

<section
  use:dragHandleZone={{
    items: view,
    flipDurationMs
  }}
  onconsider={handleSort}
  onfinalize={handleSort}
  class="space-y-4 rounded-lg border-2 border-zinc-600 bg-zinc-800 p-4"
>
  {#if view.length === 0}
    <p class="opacity-50">No components added yet</p>
  {:else}
    {#each view as component, i (`${component.id}-${getShadowMarker(component) ?? ''}`)}
      <div animate:flip={{ duration: flipDurationMs }} data-is-dnd-shadow-item-hint={getShadowMarker(component)}>
        <PreviewComponent bind:component={view[i]} />
      </div>
    {/each}
  {/if}
</section>
