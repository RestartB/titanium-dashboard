<script lang="ts">
  import CaseRow from '$lib/components/cases/CaseRow.svelte';
  import Pagination from '$lib/components/ui/Pagination.svelte';
  import Beta from '$lib/components/ui/Beta.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import { ChevronLeft } from '@lucide/svelte';

  import type { CasesResponse } from '$lib/interfaces/moderation';

  const { data } = $props();

  let casesData: CasesResponse | undefined = $state(data.cases);
  let pageCount = $derived(Math.max(1, Math.ceil((casesData?.cases.length || 1) / 50)));
  let enabled = $state(data.serverSettings.modules.moderation);

  let currentPage = $state(1);
  async function changePage(newPage: number) {
    if (newPage < 1 || newPage > pageCount) return;
    currentPage = newPage;

    const response = await fetch(`/api/guild/${data.serverInfo.id}/cases?offset=${(currentPage - 1) * 50}&limit=50`);
    if (response.status === 403) {
      enabled = false;
    } else {
      const newData: CasesResponse = await response.json();
      casesData = newData;
    }
  }
</script>

{#if !data.cases_only}
  <a href={`/guild/${data.serverInfo.id}/moderation`} class="back-button group flex w-fit items-center">
    <ChevronLeft
      size={32}
      class="shrink-0 -translate-x-2 transition-transform duration-200 ease-in-out group-hover:-translate-x-3"
    />
    <p class="-ml-1">Moderation</p>
  </a>
{/if}

<div>
  <h2 class="text-4xl font-bold">Cases <Beta class="inline-block w-fit align-middle" /></h2>
  <p>View and manage cases that have been created in your server.</p>
</div>

{#if !enabled}
  <Alert>The moderation module is disabled.</Alert>
{:else if casesData}
  <ul>
    {#if casesData.cases.length === 0}
      <p class="text-zinc-400">No cases found.</p>
    {:else}
      {#each casesData.cases as caseData (caseData.id)}
        <CaseRow case={caseData} guild={data.serverInfo.id} />
        <hr class="my-2 border-zinc-500 last:hidden" />
      {/each}
    {/if}
  </ul>

  <Pagination bind:currentPage {pageCount} {changePage} />
{/if}
