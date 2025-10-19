<script lang="ts">
  import Error from '$lib/components/errors/Error.svelte';
  import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast } from '@lucide/svelte';
  import type { ErrorLogs } from '$lib/types/serverInfo';

  const { data } = $props();

  let errorData: ErrorLogs = $state(data.errors);
  let pageCount = $derived(Math.max(1, Math.ceil(errorData.total_count / 50)));

  let currentPage = $state(1);
  const changePage = async function (newPage: number) {
    if (newPage < 1 || newPage > pageCount) return;
    currentPage = newPage;

    const response = await fetch(
      `/api/guild/${data.serverInfo.id}/errors?offset=${(currentPage - 1) * 50}&limit=50`
    );
    const newData: ErrorLogs = await response.json();

    errorData = newData;
  };
</script>

<div>
  <h2 class="text-4xl font-bold">Error Log</h2>
  <p>
    View errors that have occurred in Titanium in this server. Found something that doesn't look
    right or facing other issues? Join the support server and ask for assistance.
  </p>
</div>

<ul class="flex w-full list-none flex-col gap-2">
  {#each errorData.errors as error}
    <li class="w-full">
      <Error {error} />
    </li>
  {/each}
</ul>

{#if errorData.errors.length === 0}
  <p class="text-zinc-400">No errors have been logged.</p>
{/if}

{#if pageCount > 1}
  <div class="flex w-full items-center justify-center gap-2">
    <button
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-200 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={currentPage === 1}
      onclick={() => changePage(1)}
      aria-label="First Page"
    >
      <ChevronFirst class="h-5 w-5" />
    </button>
    <button
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-200 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={currentPage === 1}
      onclick={() => changePage(currentPage - 1)}
      aria-label="Previous Page"
    >
      <ChevronLeft class="h-5 w-5" />
    </button>
    <p class="text-zinc-400">Page {currentPage} of {pageCount}</p>
    <button
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-200 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={currentPage === pageCount}
      onclick={() => changePage(currentPage + 1)}
      aria-label="Next Page"
    >
      <ChevronRight class="h-5 w-5" />
    </button>
    <button
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-200 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={currentPage === pageCount}
      onclick={() => changePage(pageCount)}
      aria-label="Last Page"
    >
      <ChevronLast class="h-5 w-5" />
    </button>
  </div>
{/if}
