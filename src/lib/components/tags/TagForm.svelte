<script lang="ts">
  import { createTag, editTag } from '$lib/remote/tags.remote';
  import GifPicker from '$lib/components/pickers/GifPicker.svelte';

  const { form, guildId }: { form: typeof createTag | typeof editTag; guildId: string } = $props();

  let gifPickerOpen = $state(false);
</script>

{#if gifPickerOpen}
  <GifPicker
    bind:overlayOpen={gifPickerOpen}
    onSelect={(gif) =>
      createTag.fields.content.set(
        createTag.fields.content.value() ? `${gif} ${createTag.fields.content.value()}` : gif
      )}
  />
{/if}

<input type="hidden" {...form.fields.guildId.as('text')} value={guildId} />

<div class="w-full text-left">
  <label class="font-medium" for="tag-name">Name</label>
  <p class="mb-2 text-sm text-zinc-400">Enter the name of the tag.</p>
  <input type="text" class="w-full rounded-lg bg-zinc-800 p-2" id="tag-name" {...form.fields.name.as('text')} />
</div>

{#each form.fields.name.issues() as issue (issue.message)}
  <p class="text-red-300">{issue.message}</p>
{/each}

<div class="w-full text-left">
  <div class="flex items-center gap-2">
    <div>
      <label class="font-medium" for="tag-content">Content</label>
      <p class="mb-2 text-sm text-zinc-400">Enter the content of the tag.</p>
    </div>

    <button
      class="ml-auto cursor-pointer rounded-lg bg-zinc-800 p-1 px-2 font-bold transition-colors hover:bg-zinc-600"
      type="button"
      onclick={() => (gifPickerOpen = true)}
    >
      GIF
    </button>
  </div>

  <textarea class="w-full rounded-lg bg-zinc-800 p-2" rows={4} id="tag-content" {...form.fields.content.as('text')}
  ></textarea>
</div>

{#each form.fields.content.issues() as issue (issue.message)}
  <p class="text-red-300">{issue.message}</p>
{/each}

<!-- TODO: handle tag name already exists -->
{#if form.result && !form.result.success}
  <p class="text-red-300">An error occurred. Please try again in a few moments.</p>
{/if}
