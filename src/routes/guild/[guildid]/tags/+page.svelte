<script lang="ts">
  import Alert from '$lib/components/ui/Alert.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import Saver from '$lib/components/Saver.svelte';

  const { data } = $props();
  let dataState = $state(data);
</script>

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Tags</h2>
    <p>Send server wide quick responses with key words. Create new tags, or click on a tag to edit or delete.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.tags} />
</div>

<Saver {data} page="tags" bind:dataState />

<Alert>Due to a technical issue, this page is currently disabled.</Alert>

<!-- <script lang="ts">
  import { getTags, createTag } from '$lib/remote/tags.remote';
  import { newTagSchema } from '$lib/validators/tags';

  import Saver from '$lib/components/Saver.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Tag from '$lib/components/tags/Tag.svelte';
  import TagForm from '$lib/components/tags/TagForm.svelte';
  import ToggleRow from '$lib/components/ui/row/ToggleRow.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import LimitPill from '$lib/components/ui/LimitPill.svelte';
  import { RefreshCw, Plus, LoaderCircle, X } from '@lucide/svelte';

  const { data } = $props();
  let dataState = $state(data);
  let overlayOpen = $state(false);

  let currentPage = $state(1);

  let tagsFunction = $derived(
    getTags({
      guildId: data.serverInfo.id,
      limit: 50,
      offset: 50 * currentPage - 50
    })
  );
  let totalCount = $derived((await tagsFunction).total_count);
  let pageCount = $derived(Math.max(1, Math.ceil(totalCount / 50)));

  $effect(() => {
    if (createTag.result && createTag.result.success) {
      overlayOpen = false;
    }
  });

  function changePage(page: number) {
    currentPage = page;
  }
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

<Saver {data} page="tags" bind:dataState />

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Tags</h2>
    <p>Send server wide quick responses with key words. Create new tags, or click on a tag to edit or delete.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.tags} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.tags}>
  <p class="text-base font-bold text-zinc-300/60">Settings</p>

  <ToggleRow bind:toggled={dataState.pageSettings.allow_user_tags}>
    <div>
      <h2 class="text-xl font-bold">Allow User Tags</h2>
      <p>Allow user tags in this server. Users will be able to use their own tags.</p>
    </div>
  </ToggleRow>

  <ToggleRow bind:toggled={dataState.pageSettings.prefix_fallback}>
    <div>
      <h2 class="text-xl font-bold">Prefix Command Fallback</h2>
      <p>
        If a command doesn't exist in Titanium, search for it as a server tag instead. This allows custom command
        responses. The tag name must not exist as an existing Titanium command for this to work.
      </p>
    </div>
  </ToggleRow>

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Manage Server Tags</p>

  {#if data.serverSettings.modules.tags}
    <svelte:boundary>
      <div class="flex items-center gap-2">
        <Button
          onclick={() => tagsFunction.refresh()}
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
          disabled={$effect.pending() || (totalCount >= data.serverInfo.limits.tags && data.serverInfo.limits.enforcing)
            ? true
            : false}
          class="transition-all"
        >
          <Plus size={20} class="shrink-0" />
          Create
        </Button>
      </div>

      {#if data.serverInfo.limits.enforcing}
        <LimitPill amount={totalCount} limit={data.serverInfo.limits.tags} />
      {/if}

      <ul class="space-y-2">
        {#each (await tagsFunction).tags as tag (tag.id)}
          <Tag {tag} guildId={data.serverInfo.id} />
        {/each}

        <Pagination
          {changePage}
          pageCount={await pageCount}
          disabled={$effect.pending() ? true : false}
          bind:currentPage
        />
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
  {:else if !data.serverSettings.modules.tags && dataState.serverSettings.modules.tags}
    <p>To manage server tags, please save your settings first.</p>
  {:else}
    <p>To manage server tags, please enable the tags feature.</p>
  {/if}
</ToggledContent> -->
