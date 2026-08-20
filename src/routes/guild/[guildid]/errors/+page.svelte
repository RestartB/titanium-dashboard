<script lang="ts">
  import Error from '$lib/components/errors/Error.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import type { ErrorLogs } from '$lib/interfaces/serverInfo';

  const { data } = $props();

  let errorData: ErrorLogs = $state(data.errors);
  let pageCount = $derived(Math.max(1, Math.ceil(errorData.total_count / 50)));

  let currentPage = $state(1);
  async function changePage(newPage: number) {
    if (newPage < 1 || newPage > pageCount) return;
    currentPage = newPage;

    const response = await fetch(
      `/api/guild/${data.serverBranding.id}/errors?offset=${(currentPage - 1) * 50}&limit=50`
    );
    const newData: ErrorLogs = await response.json();

    errorData = newData;
  }
</script>

<div>
  <h2 class="text-4xl font-bold">Error Log</h2>
  <p>
    View errors that have occurred in Titanium in this server. Found something that doesn't look right or facing other
    issues? Join the support server and ask for assistance.
  </p>
</div>

{#if errorData.errors.length === 0}
  <p class="text-zinc-400">No errors have been logged.</p>
{:else}
  <ul class="flex w-full list-none flex-col gap-2">
    {#each errorData.errors as error (error.id)}
      <li class="w-full">
        <Error {error} />
      </li>
    {/each}
  </ul>
{/if}

<Pagination bind:currentPage {pageCount} {changePage} />
