<script lang="ts">
  import { refreshAll } from '$app/navigation';
  import { deleteComment, editComment } from '$lib/remote/cases.remote';

  import FullscreenOverlay from '../ui/FullscreenOverlay.svelte';
  import Button from '../ui/inputs/Button.svelte';
  import { CircleAlert, CircleCheck, Pencil, Send, Trash, X } from '@lucide/svelte';

  import type { ModerationCase, ModerationCaseComment } from '$lib/interfaces/moderation';
  import type { UserInfo } from '$lib/interfaces/userInfo';

  const {
    comment,
    caseData,
    userData,
    guild
  }: { comment: ModerationCaseComment; caseData: ModerationCase; userData: UserInfo; guild: string } = $props();

  const shortUserData = userData.userData;
  const editFormLocal = editComment.for(comment.id);
  editFormLocal.fields.content.set(comment.content);

  let showingDeleteError = $state(false);
  let editMode = $state(false);

  function focusOnMount(node: HTMLTextAreaElement) {
    node.focus();
  }

  $effect(() => {
    if (!editMode) {
      editFormLocal.fields.content.set(comment.content);
    }
  });
</script>

{#if showingDeleteError}
  <FullscreenOverlay bind:overlayOpen={showingDeleteError} title="Error" height={200} padding={16} gap={16}>
    <p>An error occurred while deleting the comment. Please try again later.</p>
  </FullscreenOverlay>
{/if}

<form {...editFormLocal} class="space-y-4">
  <input type="hidden" {...editFormLocal.fields.caseId.as('text')} value={caseData.id} />
  <input type="hidden" {...editFormLocal.fields.guildId.as('text')} value={guild} />
  <input type="hidden" {...editFormLocal.fields.commentId.as('text')} value={comment.id} />

  <div class="mb-2 flex h-fit w-full gap-2">
    <img src={comment.creator_pfp} width="32" height="32" class="h-8 w-8 rounded-full" alt="PFP" />
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <p class="font-bold">
          {comment.creator_display}
          <span class="font-normal"
            >(@{comment.creator_name}{comment.creator_discrim ? `#${comment.creator_discrim}` : ''})</span
          >
          <span class="align-middle text-sm font-normal text-zinc-300">
            {new Date(comment.time_created).toLocaleString()}
          </span>
        </p>

        {#if comment.creator_id === shortUserData.id}
          <button
            type="button"
            class="flex cursor-pointer items-center gap-0.5 text-sm font-normal text-zinc-300 hover:text-red-300"
            onclick={async () => {
              try {
                await deleteComment({ guildId: guild, caseId: caseData.id, commentId: comment.id });
              } catch (error) {
                showingDeleteError = true;
                throw error;
              }

              await refreshAll();
            }}
          >
            <Trash size={16} /> Delete
          </button>
          <button
            type="button"
            class="flex cursor-pointer items-center gap-0.5 text-sm font-normal text-zinc-300 hover:text-zinc-100"
            onclick={() => (editMode = !editMode)}
          >
            {#if editMode}
              <X size={16} /> Cancel
            {:else}
              <Pencil size={16} /> Edit
            {/if}
          </button>
        {/if}
      </div>
      {#if editMode}
        <textarea
          class="block min-h-8 w-full"
          placeholder="Write a comment here..."
          use:focusOnMount
          {...editFormLocal.fields.content.as('text')}
        ></textarea>
      {:else}
        <p>{comment.content}</p>
      {/if}
    </div>
  </div>

  {#if editMode}
    {#if editFormLocal.fields.content.value()}
      <Button type="submit" smallPadding={true}><Send size={16} /> Update</Button>
    {/if}

    {#each editFormLocal.fields.content.issues() as issue (issue.message)}
      <div class="flex items-center gap-1">
        <CircleAlert class="inline-block shrink-0 align-middle" size={20} />
        <p>{issue.message}</p>
      </div>
    {/each}

    {#if editFormLocal.result && !editFormLocal.result.success}
      <div class="flex items-center gap-1">
        <CircleAlert class="inline-block shrink-0 align-middle" size={20} />
        <p>Failed to edit comment, please try again later</p>
      </div>
    {:else if editFormLocal.result && editFormLocal.result.success}
      <div class="flex items-center gap-1">
        <CircleCheck class="inline-block shrink-0 align-middle" size={20} />
        <p>Comment updated</p>
      </div>
    {/if}
  {/if}
</form>
