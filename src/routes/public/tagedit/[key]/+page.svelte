<script lang="ts">
  import { page } from '$app/state';

  import TagForm from '$lib/components/tags/TagForm.svelte';
  import Row from '$lib/components/ui/row/Row.svelte';
  import { Check, CircleAlert, LoaderCircle, Pencil } from '@lucide/svelte';
  import { createTag, editTag, startEditSession } from '$lib/remote/tags.remote.js';
  import { editTagSchema, newTagSchema } from '$lib/validators/tags.js';

  import type { TagSessionData } from '$lib/interfaces/tags';

  const { data } = $props();

  let editing = $derived(data.session ? true : false);
  let loading = $state(false);

  let sessionData: TagSessionData | undefined = $derived(data.session || undefined);
  const editForm = $derived(sessionData?.tag ? editTag.for(sessionData.tag.id) : undefined);
</script>

<div class="flex h-full flex-col items-center justify-center p-4">
  <Row
    class="flex {editing && sessionData
      ? 'h-full w-full'
      : ''} max-h-250 max-w-200 flex-col items-center justify-center gap-2"
  >
    {#if !editing}
      <Pencil size={40} />
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
          <Check /> Start
        {/if}
      </button>
    {:else if !sessionData}
      <CircleAlert size={40} />
      <h2 class="text-center text-2xl font-bold">Invalid Link</h2>
      <p class="text-center">This link is invalid, or it may have expired.</p>
    {:else if sessionData.tag && editForm}
      <form
        {...editForm.preflight(editTagSchema).enhance(async (form) => {
          try {
            form.validate({ preflightOnly: true });
            if (!(await form.submit()) || !form.result || !form.result.success) {
              return;
            }
          } catch (error) {
            console.error('Error when submitting tag: ', error);
          }
        })}
        class="absolute"
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
    {:else}
      <form
        {...createTag.preflight(newTagSchema).enhance(async (form) => {
          try {
            form.validate({ preflightOnly: true });
            if (!(await form.submit()) || !form.result || !form.result.success) {
              return;
            }
          } catch (error) {
            console.error('Error when submitting tag: ', error);
          }
        })}
        class="absolute"
      >
        <TagForm form={createTag} pageKey={page.params.key} submitKey={sessionData.submit_key} cv2={true} />
      </form>
    {/if}
  </Row>
</div>
