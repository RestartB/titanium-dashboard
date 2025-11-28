<script lang="ts">
  import CaseRow from '$lib/components/cases/CaseRow.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import { ChevronLeft } from '@lucide/svelte';

  import type { CasesResponse } from '$lib/interfaces/moderation';

  const { data } = $props();

  let casesData: CasesResponse = $state(data.cases);
  let pageCount = $derived(Math.max(1, Math.ceil(casesData.cases.length / 50)));

  let currentPage = $state(1);
  async function changePage(newPage: number) {
    if (newPage < 1 || newPage > pageCount) return;
    currentPage = newPage;

    const response = await fetch(`/api/guild/${data.serverInfo.id}/errors?offset=${(currentPage - 1) * 50}&limit=50`);
    const newData: CasesResponse = await response.json();

    casesData = newData;
  }
</script>

{#if !data.cases_only}
  <a href={`/guild/${data.serverInfo.id}/moderation`} class="back-button group flex items-center">
    <ChevronLeft
      size={32}
      class="shrink-0 -translate-x-2 transition-transform duration-200 ease-in-out group-hover:-translate-x-3"
    />

    <p class="-ml-1">Moderation</p>
  </a>
{/if}

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
