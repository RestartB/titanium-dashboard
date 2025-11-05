<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import type { ModerationCase } from '$lib/interfaces/moderation';

  const { case: caseData }: { case: ModerationCase } = $props();
</script>

<Row class="">
  <div class="flex items-center">
    <img src={caseData.user_pfp} alt={caseData.user_name} class="mr-2 h-8 w-8 rounded-full" />
    <div>
      <div class="font-semibold">{caseData.user_name}</div>
      <div class="text-sm text-gray-500">{caseData.description}</div>
    </div>
  </div>
</Row>
