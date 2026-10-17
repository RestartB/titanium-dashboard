<script lang="ts">
  import { flip } from 'svelte/animate';
  import { dragHandleZone, SHADOW_ITEM_MARKER_PROPERTY_NAME, type DndEvent } from 'svelte-dnd-action';

  import FullscreenOverlay from '../ui/FullscreenOverlay.svelte';
  import Button from '../ui/inputs/Button.svelte';
  import PreviewComponent from './PreviewComponent.svelte';
  import { Link, Plus, TextAlignStart, Image, SeparatorHorizontal } from '@lucide/svelte';

  import type { ViewComponent } from '$lib/interfaces/cv2';

  const flipDurationMs = 300;

  type DndComponent = ViewComponent & Partial<Record<typeof SHADOW_ITEM_MARKER_PROPERTY_NAME, boolean>>;

  const components: { [id: number]: ViewComponent } = {
    1: {
      cId: 1,
      title: 'Button Row',
      description: 'Add a row of up to 5 link buttons.',
      Icon: Link,

      id: '',
      buttons: []
    },
    10: {
      cId: 10,
      title: 'Text',
      description: 'Add markdown text.',
      Icon: TextAlignStart,

      id: '',
      content: ''
    },
    9: {
      cId: 9,
      title: 'Text with Thumbnail',
      description: 'Add markdown text with a thumbnail to the side.',
      Icon: TextAlignStart,

      id: '',
      content: '',
      url: 'https://titanium.fyi/assets/logo.png'
    },
    12: {
      cId: 12,
      title: 'Media Gallery',
      description: 'Add photos and videos via URLs.',
      Icon: Image,

      id: '',
      urls: []
    },
    14: {
      cId: 14,
      title: 'Separator',
      description: 'Add a separator.',
      Icon: SeparatorHorizontal,

      id: '',
      spacing: 1
    }
  };
  let view: ViewComponent[] = $state([]);

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
    {#each Object.values(components) as c (c.cId)}
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

<FullscreenOverlay title="Tag Editor" gap={8} padding={16} width={700}>
  <Button border={false} onclick={() => (addOverlayOpen = true)}><Plus /> Add component</Button>

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
</FullscreenOverlay>
