<script lang="ts">
  import CaseInfo from '$lib/components/cases/CaseInfo.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import { ChevronLeft } from '@lucide/svelte';

  const { data } = $props();
</script>

<a href={`/guild/${data.serverInfo.id}/moderation/cases`} class="back-button group flex w-fit items-center">
  <ChevronLeft
    size={32}
    class="shrink-0 -translate-x-2 transition-transform duration-200 ease-in-out group-hover:-translate-x-3"
  />
  <p class="-ml-1">Cases</p>
</a>

{#if !data.serverSettings.modules.moderation}
  <Alert>The moderation module is disabled.</Alert>
{:else if data.userData && data.caseData}
  <CaseInfo case={data.caseData} guild={data.serverInfo.id} userData={data.userData} />
{/if}
