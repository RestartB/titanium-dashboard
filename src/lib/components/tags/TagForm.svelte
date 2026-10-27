<script lang="ts">
  import { onMount } from 'svelte';
  import { createTag, editTag } from '$lib/remote/tags.remote';

  import GifPicker from '$lib/components/pickers/GifPicker.svelte';
  import ViewEditor from '../cv2/ViewEditor.svelte';

  import type { ViewComponent } from '$lib/interfaces/cv2';

  const {
    form,
    guildId,
    pageKey,
    submitKey,
    cv2 = false,
    components = []
  }: {
    form: typeof createTag | ReturnType<typeof editTag.for>;
    guildId?: string;
    pageKey?: string;
    submitKey?: string;
    cv2?: boolean;
    components?: ViewComponent[];
  } = $props();

  let gifPickerOpen = $state(false);

  let localComponents: ViewComponent[] = $state([]);
  let colour = $state(form.fields.colour.value() || '#979C9F');
  let spoiler = $state(form.fields.spoiler.value() || false);

  onMount(() => {
    localComponents = components;
  });

  $effect(() => {
    form.fields.components.set(localComponents);
  });
</script>

{#if gifPickerOpen}
  <GifPicker
    bind:overlayOpen={gifPickerOpen}
    onSelect={(gif) =>
      form.fields.content.set(form.fields.content.value() ? `${gif} ${form.fields.content.value()}` : gif)}
  />
{/if}

{#if guildId}
  <input {...form.fields.guildId.as('hidden', guildId)} />
{/if}

{#if pageKey && submitKey}
  <input {...form.fields.pageKey.as('hidden', pageKey)} />
  <input {...form.fields.submitKey.as('hidden', submitKey)} />
{/if}

<input {...form.fields.cv2.as('hidden', cv2)} />
<input {...form.fields.colour.as('hidden', colour)} />
<input {...form.fields.spoiler.as('hidden', spoiler)} />

{#each localComponents as component, componentIndex (component.id)}
  <input {...form.fields.components[componentIndex].cId.as('hidden', component.cId)} />
  <input {...form.fields.components[componentIndex].id.as('hidden', component.id)} />

  {#if 'content' in component}
    <input {...form.fields.components[componentIndex].content.as('hidden', component.content)} />
  {/if}
  {#if 'url' in component}
    <input {...form.fields.components[componentIndex].url.as('hidden', component.url)} />
  {/if}
  {#if 'urls' in component}
    {#each component.urls as url, urlIndex (`${url}-${urlIndex}`)}
      <input {...form.fields.components[componentIndex].urls[urlIndex].as('hidden', url)} />
    {/each}
  {/if}
  {#if 'buttons' in component}
    {#each component.buttons as button, buttonIndex (`${button.url}-${buttonIndex}`)}
      <input {...form.fields.components[componentIndex].buttons[buttonIndex].label.as('hidden', button.label)} />
      <input {...form.fields.components[componentIndex].buttons[buttonIndex].url.as('hidden', button.url)} />
    {/each}
  {/if}
  {#if 'spacing' in component}
    <input {...form.fields.components[componentIndex].spacing.as('hidden', component.spacing)} />
  {/if}
{/each}

<div class="w-full text-left">
  <label class="font-medium" for="tag-name">Name</label>
  <p class="mb-2 text-sm text-zinc-400">Enter the name of the tag.</p>
  <input type="text" class="w-full rounded-lg bg-zinc-800 p-2" id="tag-name" {...form.fields.name.as('text')} />
</div>

{#each form.fields.name.issues() as issue (issue.message)}
  <p class="text-red-300">{issue.message}</p>
{/each}

<hr class="border-zinc-500" />

{#if cv2}
  <!-- eslint-disable-next-line svelte/require-each-key -->
  {#each form.fields.components.value()?.length === 0 ? form.fields.components.issues() : form.fields.components.allIssues() as issue}
    <p class="text-red-300">{issue.message}</p>
  {/each}

  <ViewEditor bind:view={localComponents} bind:colour bind:spoiler />
{:else}
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
{/if}

{#if form.result && !form.result.success}
  <p class="text-red-300">An error occurred. Please try again in a few moments.</p>
{/if}
