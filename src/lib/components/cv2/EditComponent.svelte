<script lang="ts">
  import FullscreenOverlay from '../ui/FullscreenOverlay.svelte';
  import UiButton from '../ui/inputs/Button.svelte';
  import Radio from '../ui/inputs/Radio.svelte';
  import { Plus, Trash, X } from '@lucide/svelte';

  import type { ViewComponent } from '$lib/interfaces/cv2';

  let {
    component = $bindable(),
    deleteThis = () => {},
    overlayOpen = $bindable(false)
  }: { component: ViewComponent; deleteThis: () => void; overlayOpen: boolean } = $props();

  let confirm = $state(false);
</script>

{#snippet extraButton()}
  <button
    class="ml-auto flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 p-2 text-zinc-400 hover:bg-zinc-600"
    type="button"
    onclick={() => {
      if (!confirm) {
        confirm = true;
        return setTimeout(() => (confirm = false), 5000);
      }

      deleteThis();
    }}
    aria-label="Copy ID to clipboard"
  >
    {#if confirm}
      <p class="mr-2">Press again</p>
      <Trash size={20} />
    {:else}
      <p class="mr-2">Delete</p>
      <Trash size={20} />
    {/if}
  </button>
{/snippet}

<FullscreenOverlay title="Edit Component" padding={16} gap={16} zIndex={60} {extraButton} bind:overlayOpen>
  {#if component.cId === 9 || component.cId === 10}
    <!-- Text -->
    <div class="w-full text-left">
      <p class="font-medium">Content</p>
      <p class="mb-2 text-sm text-zinc-400">
        Enter the content of the text. Discord style markdown is allowed but will not show in the preview.
      </p>
      <textarea class="w-full rounded-lg bg-zinc-800 p-2" rows={4} bind:value={component.content}></textarea>
    </div>

    {#if component.cId === 9}
      <!-- Text with Thumbnail -->
      <!-- TODO: debounce this so we don't send too many requests -->
      <div class="w-full text-left">
        <p class="font-medium">Thumbnail URL</p>
        <p class="mb-2 text-sm text-zinc-400">
          Enter the image URL of the thumbnail. Image must be one of the following:
          <code>png, gif, jpg/jpeg, webp, avif</code>
        </p>
        <input type="text" class="w-full rounded-lg bg-zinc-800 p-2" bind:value={component.url} />
      </div>
    {/if}
  {:else if component.cId === 1}
    <!-- Button row -->
    <UiButton
      border={false}
      type="button"
      onclick={() => component.buttons.push({ url: 'https://titanium.fyi', label: 'Button' })}
    >
      <Plus /> Add button
    </UiButton>

    <hr class="border-zinc-500" />

    <!-- eslint-disable-next-line svelte/require-each-key -->
    {#if component.buttons.length === 0}
      <p class="opacity-50">No buttons added yet</p>
    {:else}
      {#each component.buttons as button, i (i)}
        <div class="flex items-center justify-center">
          <p class="mr-auto font-bold">Button {i + 1}</p>
          <button
            class="shrink-0 cursor-pointer opacity-50 transition-opacity hover:opacity-100"
            title="Remove this button"
            type="button"
            onclick={() => component.buttons.splice(i, 1)}
          >
            <X />
          </button>
        </div>

        <div class="w-full text-left">
          <p class="font-medium">Label</p>
          <p class="mb-2 text-sm text-zinc-400">Enter the label to show on the button.</p>
          <input type="text" class="w-full rounded-lg bg-zinc-800 p-2" bind:value={button.label} />
        </div>

        <div class="w-full text-left">
          <p class="font-medium">URL</p>
          <p class="mb-2 text-sm text-zinc-400">Enter the URL of the button.</p>
          <input type="url" class="w-full rounded-lg bg-zinc-800 p-2" bind:value={button.url} />
        </div>

        <hr class="border-zinc-500 last:hidden" />
      {/each}
    {/if}
  {:else if component.cId === 12}
    <!-- Media gallery -->
    <div class="w-full text-left">
      <p class="font-medium">Media</p>
      <p class="mb-2 text-sm text-zinc-400">
        Add photo and video URLs - up to 10 are supported. Only the first 4 will appear in the preview. URL must be one
        of the following:
        <code>png, gif, jpg/jpeg, webp, avif, mp4, webm, mov</code>
      </p>
      <UiButton border={false} type="button" onclick={() => component.urls.push('')}><Plus /> Add media</UiButton>
    </div>

    <hr class="border-zinc-500" />

    {#if component.urls.length === 0}
      <p class="opacity-50">No media added yet</p>
    {:else}
      {#each component.urls as _, i (i)}
        <div class="flex w-full gap-2">
          <!-- TODO: debounce this so we don't send too many requests -->
          <input type="url" class="flex-1 rounded-lg bg-zinc-800 p-2" bind:value={component.urls[i]} />
          <button
            class="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-zinc-800 p-2 transition-colors hover:bg-zinc-600"
            title="Delete media"
            type="button"
            onclick={() => component.urls.splice(i, 1)}
          >
            <X />
          </button>
        </div>
      {/each}
    {/if}
  {:else if component.cId === 14}
    <!-- Separator -->
    <div class="w-full text-left">
      <p class="font-medium">Spacing</p>
      <p class="mb-2 text-sm text-zinc-400">Select whether the separator should have small or large spacing.</p>

      <div class="mb-2 flex w-full items-center justify-between gap-2">
        <p>Small</p>
        <Radio name="separator_spacing" value={1} bind:group={component.spacing} />
      </div>
      <div class="flex w-full items-center justify-between gap-2">
        <p>Large</p>
        <Radio name="separator_spacing" value={2} bind:group={component.spacing} />
      </div>
    </div>
  {/if}
</FullscreenOverlay>
