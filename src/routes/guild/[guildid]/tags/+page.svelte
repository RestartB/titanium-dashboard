<script lang="ts">
  import { getTags, createTag } from '$lib/remote/tags.remote';
  import { newTagSchema } from '$lib/validators/tags';

  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Tag from '$lib/components/tags/Tag.svelte';
  import TagForm from '$lib/components/tags/TagForm.svelte';

  import { RefreshCw, Plus, LoaderCircle, X } from '@lucide/svelte';

  const { data } = $props();
  let overlayOpen = $state(false);

  $effect(() => {
    if (createTag.result && createTag.result.success) {
      overlayOpen = false;
    }
  });
</script>

{#snippet submitButton()}
  <Button class="ml-auto w-fit bg-green-700! hover:bg-green-600!" border={false} smallPadding={true} type="submit">
    Submit
  </Button>
{/snippet}

{#if overlayOpen}
  <form {...createTag} {...createTag.preflight(newTagSchema)} class="absolute">
    <FullscreenOverlay title="Create Tag" padding={16} gap={16} bottomRow={submitButton} bind:overlayOpen>
      <TagForm form={createTag} guildId={data.serverInfo.id} />
    </FullscreenOverlay>
  </form>
{/if}

<div>
  <h2 class="text-4xl font-bold">Tags</h2>
  <p>Send server wide quick responses with key words. Create new tags, or click on a tag to edit or delete.</p>
</div>

<svelte:boundary>
  <div class="flex items-center gap-2">
    <Button
      onclick={() => getTags({ guildId: data.serverInfo.id, limit: 50, offset: 0 }).refresh()}
      disablePadding={true}
      disabled={$effect.pending() ? true : false}
      class="p-2 transition-all disabled:cursor-not-allowed disabled:opacity-50"
    >
      {#if $effect.pending()}
        <RefreshCw size={20} class="shrink-0 animate-spin" />
      {:else}
        <RefreshCw size={20} class="shrink-0" />
      {/if}
    </Button>

    <Button
      onclick={() => (overlayOpen = true)}
      smallPadding={true}
      disabled={$effect.pending() ? true : false}
      class="transition-all disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Plus size={20} class="shrink-0" />
      Create
    </Button>
  </div>

  <ul class="space-y-2">
    {#each (await getTags({ guildId: data.serverInfo.id, limit: 50, offset: 0 })).tags as tag (tag.id)}
      <Tag {tag} guildId={data.serverInfo.id} />
    {/each}
  </ul>

  {#snippet pending()}
    <div class="flex w-fit items-center gap-2">
      <LoaderCircle size={20} class="shrink-0 animate-spin" />
      Loading...
    </div>
  {/snippet}

  {#snippet failed()}
    <div class="flex w-fit items-center gap-4 font-bold">
      <X size={20} class="shrink-0" />
      An error occurred. Please reload the page and try again.
    </div>
  {/snippet}
</svelte:boundary>
