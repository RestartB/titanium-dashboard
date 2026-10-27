<script lang="ts">
  import { onMount } from 'svelte';
  import { getTags, editTag, deleteTag } from '$lib/remote/tags.remote';
  import { editTagSchema } from '$lib/validators/tags';

  import ButtonRow from '$lib/components/ui/row/ButtonRow.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import TagForm from '$lib/components/tags/TagForm.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';

  import PreviewComponent from '$lib/components/cv2/PreviewComponent.svelte';
  import { Code } from '@lucide/svelte';

  import type { Tag } from '$lib/interfaces/tags';

  const { tag, guildId }: { tag: Tag; guildId: string } = $props();

  let overlayOpen = $state(false);
  let editMode = $state(false);

  let deleteConfirmation = $state(false);
  let isErrored = $state(false);
  let currentTimeout: NodeJS.Timeout;

  const editFormLocal = editTag.for(tag.id);

  onMount(() => {
    editFormLocal.fields.name.set(tag.name);
    editFormLocal.fields.content.set(tag.content);
    editFormLocal.fields.components.set(tag.components);
    editFormLocal.fields.colour.set(tag.colour);
    editFormLocal.fields.spoiler.set(tag.spoiler);
  });

  $effect(() => {
    if (overlayOpen) {
      return;
    }

    editMode = false;
    deleteConfirmation = false;
  });
</script>

{#snippet bottomRow()}
  <div class="flex w-full items-center justify-end gap-2">
    {#if editMode}
      <Button
        class="w-fit bg-zinc-700! hover:bg-zinc-600!"
        border={false}
        smallPadding={true}
        onclick={() => (editMode = false)}
      >
        Cancel
      </Button>
      <Button class="w-fit bg-green-700! hover:bg-green-600!" border={false} smallPadding={true} type="submit">
        Submit
      </Button>
    {:else}
      <Button
        class="w-fit {deleteConfirmation ? 'bg-red-700! hover:bg-red-600!' : 'bg-zinc-700! hover:bg-zinc-600!'}"
        border={false}
        smallPadding={true}
        onclick={async () => {
          if (!deleteConfirmation) {
            deleteConfirmation = true;

            if (currentTimeout) {
              clearTimeout(currentTimeout);
            }

            currentTimeout = setTimeout(() => (deleteConfirmation = false), 5000);
            return;
          }

          deleteConfirmation = false;

          try {
            const deleteResult = await deleteTag({ guildId: guildId, tagId: tag.id });

            if (deleteResult.success) {
              overlayOpen = false;
              return await getTags({ guildId: guildId, limit: 50, offset: 0 }).refresh();
            }
          } catch (e) {
            console.error(e);
          }

          isErrored = true;
          if (currentTimeout) {
            clearTimeout(currentTimeout);
          }

          currentTimeout = setTimeout(() => (isErrored = false), 5000);
          return;
        }}
      >
        {#if deleteConfirmation}
          Press again to confirm
        {:else if isErrored}
          Failed, please try again
        {:else}
          Delete
        {/if}
      </Button>
      <Button
        class="w-fit bg-zinc-700! hover:bg-zinc-600!"
        border={false}
        smallPadding={true}
        onclick={() => (editMode = true)}
      >
        Edit
      </Button>
    {/if}
  </div>
{/snippet}

{#if overlayOpen}
  <form
    {...editFormLocal.preflight(editTagSchema).enhance(async (form) => {
      try {
        form.validate({ preflightOnly: true });
        if (!(await form.submit()) || !form.result || !form.result.success) {
          return;
        }
        editMode = false;
      } catch (error) {
        console.error('Error when submitting tag: ', error);
      }
    })}
    class="absolute"
  >
    <input type="hidden" {...editFormLocal.fields.tagId.as('text')} value={tag.id} />
    <FullscreenOverlay
      title={editMode ? 'Edit Tag' : 'Tag Details'}
      padding={16}
      gap={16}
      height={1000}
      width={800}
      {bottomRow}
      bind:overlayOpen
    >
      {#if editMode}
        <TagForm form={editFormLocal} {guildId} cv2={tag.cv2} components={tag.components} />
      {:else}
        <div class="w-full text-left">
          <h3 class="text-xl font-semibold">Name</h3>
          <p class="wrap-break-word">{tag.name}</p>
        </div>

        <div class="w-full text-left">
          <h3 class="mb-1 text-xl font-semibold">Content</h3>

          {#if tag.cv2}
            <div
              class="space-y-4 rounded-lg border-2 border-l-6 border-zinc-600 bg-zinc-800 p-4"
              style="border-left-color: {tag.colour}"
            >
              {#each tag.components as component (component.id)}
                <PreviewComponent {component} />
              {/each}
            </div>
          {:else}
            <p class="wrap-break-word whitespace-pre-wrap">{tag.content}</p>
          {/if}
        </div>
      {/if}
    </FullscreenOverlay>
  </form>
{/if}

<li>
  <ButtonRow class="cursor-pointer" onclick={() => (overlayOpen = true)}>
    <p class="mb-2 text-base">
      Created by <img
        src={tag.creator_pfp}
        alt="{tag.creator_name}'s PFP"
        width={20}
        height={20}
        class="inline aspect-square h-5 w-5 rounded-full align-middle"
      />
      <b>@{tag.creator_name}</b>
    </p>

    <h2 class="text-xl font-bold wrap-break-word">{tag.name}</h2>

    {#if tag.cv2}
      <span
        class="mt-1 flex w-fit items-center justify-center gap-1 rounded-full bg-zinc-500 p-1 px-2 text-sm opacity-70"
      >
        <Code size={16} /> Components v2
      </span>
    {:else}
      <p class="w-full max-w-full wrap-break-word">{tag.content}</p>
    {/if}
  </ButtonRow>
</li>
