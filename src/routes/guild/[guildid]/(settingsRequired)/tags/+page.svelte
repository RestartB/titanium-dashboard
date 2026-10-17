<script lang="ts">
  import { getTags, createTag } from '$lib/remote/tags.remote';
  import { newTagSchema } from '$lib/validators/tags';

  import Saver from '$lib/components/Saver.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Tag from '$lib/components/tags/Tag.svelte';
  import TagForm from '$lib/components/tags/TagForm.svelte';
  import ViewEditor from '$lib/components/cv2/ViewEditor.svelte';
  import ToggleRow from '$lib/components/ui/row/ToggleRow.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import LimitPill from '$lib/components/ui/LimitPill.svelte';
  import { RefreshCw, Plus, LoaderCircle, X } from '@lucide/svelte';
  import type { ViewComponent } from '$lib/interfaces/cv2.js';

  const { data } = $props();
  let dataState = $state(data);

  let basicOverlayOpen = $state(false);
  let advOverlayOpen = $state(false);
  let advComponents: ViewComponent[] = $state([]);

  let currentPage = $state(1);
  let tagsFunction = $derived(
    getTags({
      guildId: data.serverBranding.id,
      limit: 50,
      offset: 50 * currentPage - 50
    })
  );
  let totalCount = $derived((await tagsFunction).total_count);
  let pageCount = $derived(Math.max(1, Math.ceil(totalCount / 50)));

  $effect(() => {
    if (createTag.result && createTag.result.success) {
      basicOverlayOpen = false;
      advOverlayOpen = false;
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

{#if basicOverlayOpen}
  <form {...createTag} {...createTag.preflight(newTagSchema)} class="absolute">
    <input {...createTag.fields.guildId.as('hidden', data.serverBranding.id)} />
    <input {...createTag.fields.cv2.as('hidden', false)} />

    <FullscreenOverlay
      title="Create Basic Tag"
      padding={16}
      gap={16}
      bottomRow={submitButton}
      bind:overlayOpen={basicOverlayOpen}
    >
      <TagForm form={createTag} />
    </FullscreenOverlay>
  </form>
{/if}

{#if advOverlayOpen}
  <form {...createTag} {...createTag.preflight(newTagSchema)} class="absolute">
    <input {...createTag.fields.guildId.as('hidden', data.serverBranding.id)} />
    <input {...createTag.fields.cv2.as('hidden', true)} />
    {#each advComponents as component, componentIndex (component.id)}
      <input {...createTag.fields.components[componentIndex].cId.as('hidden', component.cId)} />
      {#if 'content' in component}
        <input {...createTag.fields.components[componentIndex].content.as('hidden', component.content)} />
      {/if}
      {#if 'url' in component}
        <input {...createTag.fields.components[componentIndex].url.as('hidden', component.url)} />
      {/if}
      {#if 'urls' in component}
        {#each component.urls as url, urlIndex (`${url}-${urlIndex}`)}
          <input {...createTag.fields.components[componentIndex].urls[urlIndex].as('hidden', url)} />
        {/each}
      {/if}
      {#if 'buttons' in component}
        {#each component.buttons as button, buttonIndex (`${button.url}-${buttonIndex}`)}
          <input
            {...createTag.fields.components[componentIndex].buttons[buttonIndex].label.as('hidden', button.label)}
          />
          <input {...createTag.fields.components[componentIndex].buttons[buttonIndex].url.as('hidden', button.url)} />
        {/each}
      {/if}
      {#if 'spacing' in component}
        <input {...createTag.fields.components[componentIndex].spacing.as('hidden', component.spacing)} />
      {/if}
    {/each}

    <FullscreenOverlay
      title="Create Advanced Tag"
      padding={16}
      gap={16}
      height={1000}
      width={800}
      bottomRow={submitButton}
      bind:overlayOpen={advOverlayOpen}
    >
      <div class="w-full text-left">
        <label class="font-medium" for="tag-name">Name</label>
        <p class="mb-2 text-sm text-zinc-400">Enter the name of the tag.</p>
        <input
          type="text"
          class="w-full rounded-lg bg-zinc-800 p-2"
          id="tag-name"
          {...createTag.fields.name.as('text')}
        />
      </div>

      {#each createTag.fields.name.issues() as issue (issue.message)}
        <p class="text-red-300">{issue.message}</p>
      {/each}

      <hr class="border-zinc-500" />

      {#each createTag.fields.components.issues() as issue (issue.message)}
        <p class="text-red-300">{issue.message}</p>
      {/each}

      <ViewEditor bind:view={advComponents} />
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

  <hr class="border-zinc-500" />
  <p class="text-base font-bold text-zinc-300/60">Manage Server Tags</p>

  {#if data.serverSettings.modules.tags}
    <svelte:boundary>
      <div class="flex flex-wrap items-center gap-2">
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
          onclick={() => (basicOverlayOpen = true)}
          smallPadding={true}
          disabled={$effect.pending() || (totalCount >= data.serverInfo.limits.tags && data.serverInfo.limits.enforcing)
            ? true
            : false}
          class="transition-all"
        >
          <Plus size={20} class="shrink-0" />
          Create Basic Tag
        </Button>

        <Button
          onclick={() => (advOverlayOpen = true)}
          smallPadding={true}
          disabled={$effect.pending() || (totalCount >= data.serverInfo.limits.tags && data.serverInfo.limits.enforcing)
            ? true
            : false}
          class="transition-all"
        >
          <Plus size={20} class="shrink-0" />
          Create Advanced Tag
        </Button>
      </div>

      {#if data.serverInfo.limits.enforcing}
        <LimitPill amount={totalCount} limit={data.serverInfo.limits.tags} />
      {/if}

      <ul class="space-y-2">
        {#each (await tagsFunction).tags as tag (tag.id)}
          <Tag {tag} guildId={data.serverBranding.id} />
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
</ToggledContent>
