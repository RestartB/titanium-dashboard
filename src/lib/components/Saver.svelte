<script lang="ts">
  import { beforeNavigate, invalidateAll } from '$app/navigation';
  import { fly } from 'svelte/transition';

  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import Row from '$lib/components/ui/row/Row.svelte';
  import { TriangleAlert, LoaderCircle, Copy, Check } from '@lucide/svelte';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let { page = '', data, dataState = $bindable() }: { page?: string; data: any; dataState: any } = $props();

  let originalDataString = $derived(JSON.stringify(data));
  let hasUnsavedChanges = $state(false);
  let loading = $state(false);
  let row: HTMLDivElement | undefined = $state();

  let overlayOpen = $state(false);
  let errorCode: number = $state(0);
  let errorStage: string = $state('');
  let errorMessage: string = $state('');
  let isCopied = $state(false);

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

    if (page == 'permissions') {
      const permissionsReq = await fetch(`/api/guild/${dataState.serverInfo.id}/module/perms`, {
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

    const generalSettingsReq = await fetch(`/api/guild/${dataState.serverInfo.id}/settings`, {
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
      const pageSettingsReq = await fetch(`/api/guild/${dataState.serverInfo.id}/module/${page}`, {
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
            serverId: dataState.serverInfo.id,
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
  <FullscreenOverlay bind:overlayOpen title="Error" {extraButton} height={250} padding={16} gap={16}>
    <p>{errorMessage}</p>
    <p class="mt-auto text-center font-mono text-sm text-zinc-400">
      Got code {errorCode} in stage {errorStage}
    </p>
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
