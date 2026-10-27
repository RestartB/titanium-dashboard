<script lang="ts">
  import { page } from '$app/state';

  import TagForm from '$lib/components/tags/TagForm.svelte';
  import Row from '$lib/components/ui/row/Row.svelte';
  import { Check, CircleAlert, LoaderCircle, Pencil, Tag } from '@lucide/svelte';
  import { createTag, editTag, startEditSession } from '$lib/remote/tags.remote.js';
  import { editTagSchema, newTagSchema } from '$lib/validators/tags.js';

  import type { TagSessionData } from '$lib/interfaces/tags';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';

  const { data } = $props();

  let editing = $derived(data.session ? true : false);
  let loading = $state(false);
  let submitted = $derived(false);
  let overlayOpen = $state(false);

  let sessionData: TagSessionData | undefined = $derived(data.session || undefined);
  const editForm = $derived(sessionData?.tag ? editTag.for(sessionData.tag.id) : undefined);
</script>

{#if overlayOpen}
  <FullscreenOverlay title="Help" gap={8} padding={16} bind:overlayOpen>
    <h2 class="text-xl font-bold">What are advanced tags?</h2>
    <p>
      Advanced tags use Discord's new Components v2 feature to allow for more customisation. Whereas before tags were
      limited to text only, advanced tags are much more flexible.
    </p>

    <h2 class="mt-4 text-xl font-bold">What features are available?</h2>
    <p>You can add text with markdown, images and videos in grids, thumbnails, link buttons and more.</p>

    <h2 class="mt-4 text-xl font-bold">How much can I add?</h2>
    <p>You can add up to 10 components per tag, 10 media items per media gallery, and 5 buttons per button row.</p>
  </FullscreenOverlay>
{/if}

<div class="flex h-full flex-col items-center justify-center p-4">
  <Row
    class="flex {editing && sessionData && !submitted
      ? 'h-full w-full'
      : ''} max-h-250 max-w-200 flex-col items-center justify-center {!editing || !sessionData || submitted
      ? 'gap-2'
      : 'gap-4'}"
  >
    {#if !editing}
      <Tag size={40} />
      <h2 class="text-center text-2xl font-bold">Tag Editor</h2>
      <p>Create and edit tags without signing in. Press below to begin.</p>

      <button
        class="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-2 px-4 transition-colors hover:bg-zinc-600 disabled:cursor-progress disabled:opacity-50"
        title="Start"
        disabled={loading}
        onclick={async () => {
          loading = true;
          try {
            sessionData = await startEditSession({ pageKey: page.params.key || '' });
            if (sessionData.tag && editForm) {
              editForm.fields.name.set(sessionData.tag.name);
              editForm.fields.content.set(sessionData.tag.content);
              editForm.fields.components.set(sessionData.tag.components);
            }
          } catch (error) {
            console.error(error);
            editing = false;
          }

          editing = true;
          loading = false;
        }}
      >
        {#if loading}
          <LoaderCircle class="animate-spin" /> Loading...
        {:else}
          <Pencil /> Start
        {/if}
      </button>
    {:else if submitted}
      <Check size={40} />
      <h2 class="text-center text-2xl font-bold">Done</h2>
      <p class="text-center">
        The tag has been {createTag.result?.success ? 'created' : 'edited'}. Go back to Discord to use it.
      </p>
    {:else if !sessionData}
      <CircleAlert size={40} />
      <h2 class="text-center text-2xl font-bold">Invalid Link</h2>
      <p class="text-center">This link is invalid, or it may have expired.</p>
    {:else if sessionData.tag && editForm}
      <div class="flex w-full shrink-0 items-center justify-between gap-2">
        <h2 class="text-xl font-bold">Edit Tag</h2>
        <button
          class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
          aria-label="Open help"
          type="button"
          onclick={() => (overlayOpen = true)}
        >
          <p class="text-center text-xl font-bold select-none">?</p>
        </button>
      </div>

      <form
        {...editForm.preflight(editTagSchema).enhance(async (form) => {
          try {
            form.validate({ preflightOnly: true });
            if (!(await form.submit()) || !form.result || !form.result.success) {
              return;
            }
            submitted = true;
          } catch (error) {
            console.error('Error when editing tag: ', error);
          }
        })}
        id="tag-form"
        class="flex w-full flex-1 flex-col gap-4 overflow-auto rounded-xl border-2 border-zinc-600 bg-zinc-700 p-4"
      >
        <input {...editForm.fields.tagId.as('hidden', sessionData.tag.id)} />
        <TagForm
          form={editForm}
          pageKey={page.params.key}
          submitKey={sessionData.submit_key}
          cv2={sessionData.tag.cv2}
          components={sessionData.tag.components}
        />
      </form>

      <Button
        class="ml-auto w-fit bg-green-700! hover:bg-green-600!"
        border={false}
        smallPadding={true}
        type="submit"
        form="tag-form"
      >
        Submit
      </Button>
    {:else}
      <div class="flex w-full shrink-0 items-center justify-between gap-2">
        <h2 class="text-xl font-bold">Create Tag</h2>
        <button
          class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
          aria-label="Open help"
          type="button"
          onclick={() => (overlayOpen = true)}
        >
          <p class="text-center text-xl font-bold select-none">?</p>
        </button>
      </div>

      <form
        {...createTag.preflight(newTagSchema).enhance(async (form) => {
          try {
            form.validate({ preflightOnly: true });
            if (!(await form.submit()) || !form.result || !form.result.success) {
              return;
            }
            submitted = true;
          } catch (error) {
            console.error('Error when creating tag: ', error);
          }
        })}
        id="tag-form"
        class="flex w-full flex-1 flex-col gap-4 overflow-auto rounded-xl border-2 border-zinc-600 bg-zinc-700 p-4"
      >
        <TagForm form={createTag} pageKey={page.params.key} submitKey={sessionData.submit_key} cv2={true} />
      </form>

      <Button
        class="ml-auto w-fit bg-green-700! hover:bg-green-600!"
        border={false}
        smallPadding={true}
        type="submit"
        form="tag-form"
      >
        Submit
      </Button>
    {/if}
  </Row>
</div>
