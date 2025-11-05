<script lang="ts">
  import CaseRow from '$lib/components/cases/CaseRow.svelte';
  const { data } = $props();
</script>

<div>
  <h2 class="text-4xl font-bold">Cases</h2>
  <p>View and manage cases that have been created in your server.</p>
</div>

{#if data.cases.cases.length === 0}
  <p class="text-zinc-400">No cases found.</p>
{:else}
  {#each data.cases.cases as caseData}
    <CaseRow case={caseData} />
  {/each}
{/if}
