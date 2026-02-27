<script lang="ts">
  import { refreshAll } from '$app/navigation';
  import { createComment, deleteComment } from '$lib/remote/cases.remote';
  import format from 'format-duration';

  import Alert from '$lib/components/ui/Alert.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import { TriangleAlert, VolumeOff, UserRoundX, Hammer, CircleAlert, CircleCheck, Send, Trash } from '@lucide/svelte';

  import type { ModerationCase, ModerationCaseComment } from '$lib/interfaces/moderation';

  const { case: caseData, guild, user }: { case: ModerationCase; guild: string; user: string } = $props();

  const icons = {
    warn: TriangleAlert,
    mute: VolumeOff,
    kick: UserRoundX,
    ban: Hammer
  };

  $effect(() => {
    if (createComment.fields.caseId.value() !== caseData.id) createComment.fields.caseId.set(caseData.id);
    if (createComment.fields.guildId.value() !== guild) createComment.fields.guildId.set(guild);
  });

  let showingDeleteError = $state(false);
</script>

{#if showingDeleteError}
  <FullscreenOverlay bind:overlayOpen={showingDeleteError} title="Error" height={200} padding={16} gap={16}>
    <p>An error occurred while deleting the comment. Please try again later.</p>
  </FullscreenOverlay>
{/if}

{#snippet commentRow(comment: ModerationCaseComment)}
  <div class="mb-2 flex gap-2">
    <img src={comment.creator_pfp} width="32" height="32" class="h-8 w-8 rounded-full" alt="PFP" />
    <div>
      <div class="flex items-center gap-2">
        <p class="font-bold">
          {comment.creator_display} <span class="font-normal">(@{comment.creator_name})</span>
          <span class="align-middle text-sm font-normal text-zinc-300">
            {new Date(comment.time_created).toLocaleString()}
          </span>
        </p>

        {#if comment.creator_id === user}
          <button
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
        {/if}
      </div>
      <p>{comment.content}</p>
    </div>
  </div>
{/snippet}

{#if caseData.external}
  <Alert>This action was taken without using Titanium, some info may be unavailable</Alert>
{/if}

<div class="flex items-center gap-2">
  {#if caseData.type in icons}
    {@const Icon = icons[caseData.type as keyof typeof icons]}
    <Icon class="h-8 w-8" size={20} />
  {/if}
  <div>
    <h2 class="font-mono text-3xl">{caseData.id}</h2>
    <h2 class="">{caseData.type.charAt(0).toUpperCase() + caseData.type.slice(1)}</h2>
  </div>
</div>

<div>
  <h3 class="mb-1 text-base font-bold opacity-60">Status</h3>
  <span class="flex items-center gap-2">
    {#if caseData.resolved}
      <span class="block h-4 w-4 rounded-full bg-green-500"></span>
    {:else}
      <span class="relative block h-4 w-4">
        <span class="absolute top-0 left-0 block h-4 w-4 rounded-full bg-red-500"></span>
        <span class="absolute top-0 left-0 block h-4 w-4 animate-slow-ping rounded-full bg-red-500 duration-3000"
        ></span>
      </span>
    {/if}
    {caseData.resolved ? 'Resolved' : 'Open'}
  </span>
</div>

<div>
  <h3 class="mb-1 text-base font-bold opacity-60">Created</h3>
  <p>{new Date(caseData.time_created).toLocaleString()}</p>
</div>

<div>
  <h3 class="mb-1 text-base font-bold opacity-60">Moderator</h3>
  <div class="mt-1 flex items-center gap-2">
    <img
      src={caseData.creator_pfp}
      alt="{caseData.creator_name}'s PFP"
      width="32"
      height="32"
      class="h-8 w-8 rounded-full"
    />
    <div>
      <p class="font-semibold">{caseData.creator_display} (@{caseData.creator_name})</p>
      <p class="font-mono text-sm text-zinc-300">{caseData.creator_id}</p>
    </div>
  </div>
</div>

<div>
  <h3 class="mb-1 text-base font-bold opacity-60">Punished user</h3>
  <div class="mt-1 flex items-center gap-2">
    <img src={caseData.user_pfp} alt="{caseData.user_name}'s PFP" width="32" height="32" class="h-8 w-8 rounded-full" />
    <div>
      <p class="font-semibold">{caseData.user_display} (@{caseData.user_name})</p>
      <p class="font-mono text-sm text-zinc-300">{caseData.user_id}</p>
    </div>
  </div>
</div>

{#if caseData.time_expires}
  {@const created = new Date(caseData.time_created)}
  {@const expires = new Date(caseData.time_expires)}
  <div>
    <h3 class="mb-1 text-base font-bold opacity-60">Duration</h3>
    <p>{format(expires.getTime() - created.getTime())}</p>
  </div>
{/if}

<div>
  <h3 class="mb-1 text-base font-bold opacity-60">Reason</h3>
  <p>{caseData.description}</p>
</div>

<hr class=" border-zinc-500" />
<p class="text-base font-bold text-zinc-300/60">Comments</p>

<Alert
  ><span
    >Comments cannot be edited from the dashboard currently. Please use the <code>case comments</code> command in Discord
    to edit comments.</span
  ></Alert
>

{#if caseData.comments.length === 0}
  <p class="opacity-80">There are no comments yet.</p>
{:else}
  {#each caseData.comments as comment}
    {@render commentRow(comment)}
  {/each}
{/if}

<form {...createComment} class="space-y-4">
  <input type="hidden" {...createComment.fields.caseId.as('text')} value={caseData.id} />
  <input type="hidden" {...createComment.fields.guildId.as('text')} value={guild} />
  <div class="w-full overflow-hidden rounded-xl border-2 border-zinc-700 bg-zinc-800">
    <div class="p-2">
      <textarea class="block h-full w-full" {...createComment.fields.content.as('text')}></textarea>
    </div>

    <hr class="border-zinc-700" />

    <button
      type="submit"
      class="flex w-full cursor-pointer items-center justify-center gap-2 p-2 transition-colors hover:bg-zinc-700"
    >
      <Send size={16} /> Post
    </button>
  </div>

  {#each createComment.fields.content.issues() as issue}
    <div class="flex items-center gap-1">
      <CircleAlert class="inline-block shrink-0 align-middle" size={20} />
      <p>{issue.message}</p>
    </div>
  {/each}

  {#if createComment.result && !createComment.result.success}
    <div class="flex items-center gap-1">
      <CircleAlert class="inline-block shrink-0 align-middle" size={20} />
      <p>Failed to create comment, please try again later</p>
    </div>
  {:else if createComment.result && createComment.result.success}
    <div class="flex items-center gap-1">
      <CircleCheck class="inline-block shrink-0 align-middle" size={20} />
      <p>Comment created</p>
    </div>
  {/if}
</form>
