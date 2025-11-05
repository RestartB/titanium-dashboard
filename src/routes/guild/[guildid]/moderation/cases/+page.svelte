<script lang="ts">
  import CaseRow from '$lib/components/cases/CaseRow.svelte';
  const { data } = $props();
</script>

<div>
  <h2 class="text-4xl font-bold">Moderation</h2>
  <p>Moderate your server and manage cases.</p>
</div>

{#each data.cases.cases as caseData}
  <CaseRow case={caseData} />
{/each}
