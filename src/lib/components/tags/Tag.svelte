<script lang="ts">
  import { onMount } from 'svelte';
  import { getTags, editTag, deleteTag } from '$lib/remote/tags.remote';
  import { editTagSchema } from '$lib/validators/tags';

  import ButtonRow from '$lib/components/ui/row/ButtonRow.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import TagForm from '$lib/components/tags/TagForm.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';

  import type { Tag } from '$lib/interfaces/tags';

  const { tag, guildId }: { tag: Tag; guildId: string } = $props();

  let overlayOpen = $state(false);
  let editMode = $state(false);

  let deleteConfirmation = $state(false);
  let isErrored = $state(false);
  let currentTimeout: NodeJS.Timeout;

  onMount(() => {
    editTag.fields.name.set(tag.name);
    editTag.fields.content.set(tag.content);
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
  <form {...editTag} {...editTag.preflight(editTagSchema)} class="absolute">
    <input type="hidden" {...editTag.fields.tagId.as('text')} value={tag.id} />
    <FullscreenOverlay title={editMode ? 'Edit Tag' : 'Tag Details'} padding={16} gap={16} {bottomRow} bind:overlayOpen>
      {#if editMode}
        <TagForm form={editTag} {guildId} />
      {:else}
        <div class="w-full text-left">
          <h3 class="text-xl font-semibold">Name</h3>
          <p class="wrap-break-word">{tag.name}</p>
        </div>

        <div class="w-full text-left">
          <h3 class="text-xl font-semibold">Content</h3>
          <p class="wrap-break-word">{tag.content}</p>
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
    <p class="w-full max-w-full wrap-break-word">{tag.content}</p>
  </ButtonRow>
</li>
