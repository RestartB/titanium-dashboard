<script lang="ts">
  import CaseRow from '$lib/components/cases/CaseRow.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import { ChevronLeft } from '@lucide/svelte';

  import type { CasesResponse } from '$lib/interfaces/moderation';

  const { data } = $props();

  let casesData: CasesResponse = $state(data.cases);
  let pageCount = $derived(Math.max(1, Math.ceil(casesData.cases.length / 50)));

  let currentPage = $state(1);
  const changePage = async function (newPage: number) {
    if (newPage < 1 || newPage > pageCount) return;
    currentPage = newPage;

    const response = await fetch(`/api/guild/${data.serverInfo.id}/errors?offset=${(currentPage - 1) * 50}&limit=50`);
    const newData: CasesResponse = await response.json();

    casesData = newData;
  };
</script>

<a href={`/guild/${data.serverInfo.id}/moderation`} class="back-button group flex items-center">
  <ChevronLeft
    size={32}
    class="flex-shrink-0 transition-transform duration-200 ease-in-out group-hover:-translate-x-3 -translate-x-2"
  />

  <p class="-ml-1">Moderation</p>
</a>

<div>
  <h2 class="text-4xl font-bold">Cases</h2>
  <p>View and manage cases that have been created in your server.</p>
</div>

{#if casesData.cases.length === 0}
  <p class="text-zinc-400">No cases found.</p>
{:else}
  {#each casesData.cases as caseData}
    <CaseRow case={caseData} />
  {/each}
{/if}

<Pagination bind:currentPage {pageCount} {changePage} />
