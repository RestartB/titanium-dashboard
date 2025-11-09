<script lang="ts">
  import { beforeNavigate, invalidateAll } from '$app/navigation';
  import { fly } from 'svelte/transition';

  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import Row from '$lib/components/ui/row/Row.svelte';
  import { TriangleAlert, LoaderCircle, X } from '@lucide/svelte';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let { page = '', dataState = $bindable() }: { page?: string; dataState: any } = $props();

  let originalDataString = JSON.stringify(dataState);
  let hasUnsavedChanges = $state(false);
  let loading = $state(false);
  let row: HTMLDivElement | undefined = $state();

  let overlayOpen = $state(false);
  let errorCode: number = $state(0);
  let errorStage: string = $state('');

  $effect(() => {
    const currentDataString = JSON.stringify(dataState);
    hasUnsavedChanges = originalDataString !== currentDataString;
  });

  beforeNavigate((nav) => {
    if (hasUnsavedChanges) {
      nav.cancel();
      row?.classList.add('animate-warning');

      if (row) {
        row.style.setProperty('background-color', 'oklch(44.4% 0.177 26.899)', 'important');
      }

      row?.addEventListener(
        'animationend',
        () => {
          row?.classList.remove('animate-warning');
          if (row) {
            row.style.removeProperty('background-color');
          }
        },
        { once: true }
      );
    }
  });

  async function saveChanges() {
    if (loading) return;
    loading = true;

    const generalSettingsReq = await fetch(`/api/guild/${dataState.serverInfo.id}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataState.serverSettings)
    });

    if (!generalSettingsReq.ok) {
      errorCode = generalSettingsReq.status;
      errorStage = '1';

      overlayOpen = true;
      loading = false;
      return;
    }

    if (page) {
      const pageSettingsReq = await fetch(`/api/guild/${dataState.serverInfo.id}/module/${page}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataState.pageSettings)
      });

      if (!pageSettingsReq.ok) {
        errorCode = pageSettingsReq.status;
        errorStage = '2';

        overlayOpen = true;
        loading = false;
        return;
      }
    }

    await invalidateAll();
    hasUnsavedChanges = false;
    loading = false;
  }

  function resetChanges() {
    if (loading) return;
    dataState = JSON.parse(originalDataString);
    hasUnsavedChanges = false;
  }
</script>

{#if overlayOpen}
  <FullscreenOverlay {overlayOpen}>
    <div
      class="flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
    >
      <div class="flex w-full items-center justify-between gap-2">
        <h2 class="text-xl font-bold">Error</h2>
        <button
          class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
          onclick={() => (overlayOpen = false)}
          aria-label="Close error popup"
        >
          <X size={24} />
        </button>
      </div>

      <div
        class="flex h-full max-h-40 min-h-40 w-full max-w-120 shrink-0 flex-col gap-4 overflow-auto rounded-xl border-2 border-zinc-600 bg-zinc-700 p-4"
      >
        <p>An error occurred while saving your changes. Please try again later.</p>
        <p class="mt-auto text-center font-mono text-sm text-zinc-400">
          Got code {errorCode} in stage {errorStage}
        </p>
      </div>
    </div>
  </FullscreenOverlay>
{/if}

{#if hasUnsavedChanges}
  <div
    class="fixed inset-0 z-100 mt-12 flex flex-col items-center justify-end overflow-hidden p-4"
    class:pointer-events-none={!loading}
    class:cursor-not-allowed={loading}
    transition:fly={{ y: 20, duration: 200 }}
  >
    <Row
      class="pointer-events-auto w-full max-w-180 bg-zinc-800/60 backdrop-blur-lg transition-colors"
      bind:thisElement={row}
    >
      <div class="flex h-full w-full flex-col items-center justify-between gap-4 xxs:flex-row">
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
