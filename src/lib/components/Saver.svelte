<script lang="ts">
  import { beforeNavigate } from '$app/navigation';
  import { fly } from 'svelte/transition';
  import Row from '$lib/components/ui/row/Row.svelte';
  import { TriangleAlert, LoaderCircle } from '@lucide/svelte';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let { page = '', dataState = $bindable() }: { page?: string; dataState: any } = $props();

  let originalDataString = JSON.stringify(dataState);
  let hasUnsavedChanges = $state(false);
  let loading = $state(false);
  let row: HTMLDivElement | undefined = $state();

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

    await fetch(`/api/guild/${dataState.serverInfo.id}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataState.serverSettings)
    });

    if (page) {
      await fetch(`/api/guild/${dataState.serverInfo.id}/module/${page}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataState.pageSettings)
      });
    }

    hasUnsavedChanges = false;
    loading = false;
  }

  function resetChanges() {
    if (loading) return;
    dataState = JSON.parse(originalDataString);
    hasUnsavedChanges = false;
  }
</script>

{#if hasUnsavedChanges}
  <div
    class="pointer-events-none fixed inset-0 z-10 mt-12 flex flex-col items-center justify-end overflow-hidden p-4"
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
        <div class="flex flex-shrink-0 items-center justify-center gap-2">
          <button
            class="cursor-pointer rounded-lg bg-zinc-600 px-2 py-1 transition-all hover:bg-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
            onclick={resetChanges}
            disabled={loading}>Reset</button
          >
          <button
            class="cursor-pointer rounded-lg bg-green-600 px-2 py-1 transition-all hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
            onclick={saveChanges}
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
