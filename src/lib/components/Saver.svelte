<script lang="ts">
  import { beforeNavigate, invalidateAll } from '$app/navigation';
  import { fly, slide } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import Row from '$lib/components/ui/row/Row.svelte';
  import { TriangleAlert, LoaderCircle, Copy, Check, ChevronDown } from '@lucide/svelte';
  import { tick } from 'svelte';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let { page = '', data, dataState = $bindable() }: { page?: string; data: any; dataState: any } = $props();

  let originalDataString = $derived(JSON.stringify(data));
  let hasUnsavedChanges = $derived(originalDataString !== JSON.stringify(dataState));
  let expanded = $derived(hasUnsavedChanges);
  let loading = $state(false);

  let container: HTMLDivElement | undefined = $state();
  let row: HTMLDivElement | undefined = $state();

  let overlayOpen = $state(false);
  let errorCode: number = $state(0);
  let errorStage: string = $state('');
  let errorMessage: string = $state('');
  let isCopied = $state(false);

  beforeNavigate(async (nav) => {
    if (!hasUnsavedChanges) {
      return;
    }

    nav.cancel();
    expanded = true;
    await tick();

    row?.style.setProperty('background-color', 'oklch(44.4% 0.177 26.899)', 'important');
    container?.classList.add('animate-warning');
    container?.addEventListener(
      'animationend',
      () => {
        container?.classList.remove('animate-warning');
        row?.style.removeProperty('background-color');
      },
      {
        once: true
      }
    );
  });

  async function saveChanges() {
    if (loading) return;
    loading = true;

    if (page == 'permissions') {
      const permissionsReq = await fetch(`/api/guild/${dataState.serverBranding.id}/module/perms`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataState.pageSettings)
      });

      if (!permissionsReq.ok) {
        errorMessage =
          (await permissionsReq.json())['message'] ||
          'Failed to update settings on Titanium server. Please try again later.';
        errorCode = permissionsReq.status;
        errorStage = '1';

        overlayOpen = true;
        loading = false;
        return;
      }

      await invalidateAll();

      dataState = data;
      hasUnsavedChanges = false;
      overlayOpen = false;
      loading = false;

      return;
    }

    const generalSettingsReq = await fetch(`/api/guild/${dataState.serverBranding.id}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataState.serverSettings)
    });

    if (!generalSettingsReq.ok) {
      errorMessage =
        (await generalSettingsReq.json())['message'] ||
        'Failed to update settings on Titanium server. Please try again later.';
      errorCode = generalSettingsReq.status;
      errorStage = '2';

      overlayOpen = true;
      loading = false;
      return;
    }

    if (page) {
      const pageSettingsReq = await fetch(`/api/guild/${dataState.serverBranding.id}/module/${page}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataState.pageSettings)
      });

      if (!pageSettingsReq.ok) {
        errorMessage =
          (await pageSettingsReq.json())['message'] ||
          'Failed to update settings on Titanium server. Please try again later.';
        errorCode = pageSettingsReq.status;
        errorStage = '3';

        overlayOpen = true;
        loading = false;
        return;
      }
    }

    await invalidateAll();

    dataState = data;
    hasUnsavedChanges = false;
    overlayOpen = false;
    loading = false;
  }

  function resetChanges() {
    if (loading) return;
    dataState = JSON.parse(originalDataString);
  }
</script>

{#snippet extraButton()}
  <button
    class="ml-auto flex h-8 w-24 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 p-2 text-zinc-400 hover:bg-zinc-600"
    onclick={() =>
      navigator.clipboard
        .writeText(
          JSON.stringify({
            serverId: dataState.serverBranding.id,
            pageSettings: dataState.pageSettings,
            serverSettings: dataState.serverSettings
          })
        )
        .then(() => {
          isCopied = true;
          setTimeout(() => (isCopied = false), 3000);
        })}
    aria-label="Copy data to clipboard"
  >
    {#if isCopied}
      <p class="mr-2">Done</p>
      <Check size={20} />
    {:else}
      <p class="mr-2">Copy</p>
      <Copy size={20} />
    {/if}
  </button>
{/snippet}

{#if overlayOpen}
  <FullscreenOverlay bind:overlayOpen title="Error" {extraButton} padding={16} gap={24}>
    <p class="whitespace-pre-wrap">{errorMessage}</p>
    <p class="mt-auto text-center font-mono text-sm text-zinc-400">
      Got code {errorCode} in stage {errorStage}
    </p>
  </FullscreenOverlay>
{/if}

{#if hasUnsavedChanges}
  <div
    class="fixed inset-0 z-100 mt-12 flex flex-col items-center justify-end overflow-hidden p-4 pb-0"
    class:pointer-events-none={!loading}
    class:cursor-not-allowed={loading}
    transition:fly={{ y: 20, duration: 200 }}
  >
    <div bind:this={container} class="flex w-full max-w-180 flex-col items-center justify-center">
      <button
        onclick={() => (expanded = !expanded)}
        title="{expanded ? 'Collapse' : 'Reveal'} save changes panel"
        class="pointer-events-auto flex h-fit w-20 cursor-pointer items-center justify-center rounded-t-xl border-2 border-b-0 border-zinc-700 bg-zinc-800/60 backdrop-blur-lg"
      >
        <ChevronDown
          class="shrink-0 transition-transform duration-400 {expanded
            ? 'transform-[rotateX(0deg)]'
            : 'transform-[rotateX(180deg)]'}"
        />
      </button>

      {#if expanded}
        <div class="w-full" transition:slide={{ easing: cubicInOut }}>
          <Row
            class="pointer-events-auto w-full rounded-b-none! border-b-0 bg-zinc-800/60! backdrop-blur-lg transition-colors"
            bind:thisElement={row}
          >
            <div class="flex h-full w-full flex-col items-center justify-between gap-4 xs:flex-row">
              <div class="flex items-center gap-2">
                <TriangleAlert size={20} />
                <p>You have unsaved changes.</p>
              </div>
              <div class="flex shrink-0 items-center justify-center gap-2">
                <button
                  class="min-h-9 cursor-pointer rounded-lg bg-zinc-600 px-2 py-1 transition-all hover:bg-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
                  onclick={resetChanges}
                  disabled={loading}>Reset</button
                >
                <button
                  class="flex min-h-9 min-w-32 cursor-pointer items-center justify-center rounded-lg bg-green-600 px-2 py-1 transition-all hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                  onclick={saveChanges}
                  aria-label={loading ? 'Saving changes' : 'Save changes'}
                >
                  {#if loading}
                    <LoaderCircle size={20} class="animate-spin" />
                  {:else}
                    Save changes
                  {/if}
                </button>
              </div>
            </div>
          </Row>
        </div>
      {/if}
    </div>
  </div>
{/if}
