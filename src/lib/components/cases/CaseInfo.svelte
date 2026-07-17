<script lang="ts">
  import { createComment } from '$lib/remote/cases.remote';
  import { defaultPfpUrl } from '$lib/helpers/discord';
  import format from 'format-duration';

  import Alert from '$lib/components/ui/Alert.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import { TriangleAlert, VolumeOff, UserRoundX, Hammer, CircleAlert, CircleCheck, Send } from '@lucide/svelte';

  import type { ModerationCase } from '$lib/interfaces/moderation';
  import type { UserInfo } from '$lib/interfaces/userInfo';
  import CaseComment from './CaseComment.svelte';

  const { case: caseData, guild, userData }: { case: ModerationCase; guild: string; userData: UserInfo } = $props();
  const shortUserData = userData.userData;

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
</script>

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
      src={caseData.creator_pfp || defaultPfpUrl(caseData.creator_id)}
      alt="{caseData.creator_name || caseData.creator_id}'s PFP"
      width="32"
      height="32"
      class="h-8 w-8 rounded-full"
    />

    {#if caseData.creator_id}
      <div>
        <p class="font-semibold">
          {caseData.creator_display} (@{caseData.creator_name}{caseData.creator_discrim
            ? `#${caseData.creator_discrim}`
            : ''})
        </p>
        <p class="font-mono text-sm text-zinc-300">{caseData.creator_id}</p>
      </div>
    {:else}
      <p class="font-semibold">{caseData.creator_id}</p>
    {/if}
  </div>
</div>

<div>
  <h3 class="mb-1 text-base font-bold opacity-60">Punished user</h3>
  <div class="mt-1 flex items-center gap-2">
    <img
      src={caseData.user_pfp || defaultPfpUrl(caseData.user_id)}
      alt="{caseData.user_name || caseData.user_id}'s PFP"
      width="32"
      height="32"
      class="h-8 w-8 rounded-full"
    />

    {#if caseData.user_name}
      <div>
        <p class="font-semibold">
          {caseData.user_display} (@{caseData.user_name}{caseData.user_discrim ? `#${caseData.user_discrim}` : ''})
        </p>
        <p class="font-mono text-sm text-zinc-300">{caseData.user_id}</p>
      </div>
    {:else}
      <p class="font-semibold">{caseData.user_id}</p>
    {/if}
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
  <p class:opacity-80={!caseData.description}>{caseData.description || 'No description provided.'}</p>
</div>

<hr class="border-zinc-500" />
<p class="text-base font-bold text-zinc-300/60">Comments</p>

{#if caseData.comments.length === 0}
  <p class="opacity-80">There are no comments yet.</p>
{:else}
  {#each caseData.comments as comment (comment.id)}
    <CaseComment {comment} {caseData} {userData} {guild} />
  {/each}
{/if}

<hr class="border-zinc-500" />

<form {...createComment} class="space-y-4">
  <input type="hidden" {...createComment.fields.caseId.as('text')} value={caseData.id} />
  <input type="hidden" {...createComment.fields.guildId.as('text')} value={guild} />
  <div class="mb-2 flex h-fit w-full gap-2">
    <Avatar
      src={shortUserData.avatar
        ? `https://cdn.discordapp.com/avatars/${shortUserData.id}/${shortUserData.avatar}.png`
        : undefined}
      name={shortUserData.global_name || shortUserData.username}
      size={32}
      circle={true}
      class="border-0!"
    />
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <p class="font-bold">
          {shortUserData.global_name}
          <span class="font-normal">(@{shortUserData.username})</span>
        </p>
      </div>
      <textarea
        class="block min-h-8 w-full"
        placeholder="Write a comment here..."
        {...createComment.fields.content.as('text')}></textarea>
    </div>
  </div>

  {#if createComment.fields.content.value()}
    <Button type="submit" smallPadding={true}><Send size={16} /> Post</Button>
  {/if}

  {#each createComment.fields.content.issues() as issue (issue.message)}
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
