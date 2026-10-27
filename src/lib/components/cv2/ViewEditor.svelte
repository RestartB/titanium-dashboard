<script lang="ts">
  import { flip } from 'svelte/animate';
  import { dragHandleZone, SHADOW_ITEM_MARKER_PROPERTY_NAME, type DndEvent } from 'svelte-dnd-action';

  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import PreviewComponent from './PreviewComponent.svelte';
  import { Palette, Plus } from '@lucide/svelte';

  import { createComponent, cv2Metadata } from '$lib/helpers/discord';
  import type { ViewComponent } from '$lib/interfaces/cv2';

  let {
    view = $bindable(),
    colour = $bindable(),
    spoiler = $bindable()
  }: { view: ViewComponent[]; colour: string; spoiler: boolean } = $props();

  type DndComponent = ViewComponent & Partial<Record<typeof SHADOW_ITEM_MARKER_PROPERTY_NAME, boolean>>;
  const flipDurationMs = 300;

  let addOverlayOpen = $state(false);
  let overlayOpen = $state(false);

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
    {#each Object.values(cv2Metadata) as c (c.cId)}
      {@const Icon = c.Icon}
      <button
        class="flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 px-4 transition-all hover:bg-zinc-800"
        aria-label="Select {c.title} component"
        type="button"
        onclick={() => {
          view.push(createComponent(c.cId, crypto.randomUUID()));
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

{#if overlayOpen}
  <FullscreenOverlay title="Customisation" padding={16} gap={16} zIndex={60} bind:overlayOpen>
    <div class="w-full text-left">
      <p class="font-medium">Colour</p>
      <p class="mb-2 text-sm text-zinc-400">Set the colour of the tag.</p>
      <input
        type="color"
        class="h-11 w-full overflow-hidden rounded-lg border-2 border-zinc-600 bg-zinc-800 p-1"
        bind:value={colour}
      />
    </div>

    <div class="flex w-full items-center justify-between gap-2">
      <div>
        <p class="font-medium">Spoiler</p>
        <p class="mb-2 text-sm text-zinc-400">Whether to hide the component's contents behind a spoiler.</p>
      </div>
      <Toggle bind:toggled={spoiler} />
    </div>
  </FullscreenOverlay>
{/if}

<div class="flex flex-wrap items-center gap-2">
  <Button class="border-zinc-600! bg-zinc-800! hover:bg-zinc-600!" onclick={() => (addOverlayOpen = true)}
    ><Plus /> Add component</Button
  >
  <Button class="border-zinc-600! bg-zinc-800! hover:bg-zinc-600!" onclick={() => (overlayOpen = true)}
    ><Palette /> Customise</Button
  >
</div>

<section
  use:dragHandleZone={{
    items: view,
    flipDurationMs
  }}
  onconsider={handleSort}
  onfinalize={handleSort}
  class="space-y-4 rounded-lg border-2 border-l-6 border-zinc-600 bg-zinc-800 p-4"
  style="border-left-color: {colour};"
>
  {#if view.length === 0}
    <p class="opacity-50">No components added yet</p>
  {:else}
    {#each view as component, i (`${component.id}-${getShadowMarker(component) ?? ''}`)}
      <div animate:flip={{ duration: flipDurationMs }} data-is-dnd-shadow-item-hint={getShadowMarker(component)}>
        <PreviewComponent bind:component={view[i]} editMode={true} deleteThis={() => view.splice(i, 1)} />
      </div>
    {/each}
  {/if}
</section>
