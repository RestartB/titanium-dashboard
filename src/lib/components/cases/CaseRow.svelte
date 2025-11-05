<script lang="ts">
  import AnchorRow from '$lib/components/ui/row/AnchorRow.svelte';
  import { TriangleAlert, VolumeOff, UserRoundX, Hammer } from '@lucide/svelte';
  import type { ModerationCase } from '$lib/interfaces/moderation';

  const icons = {
    warn: TriangleAlert,
    mute: VolumeOff,
    ban: UserRoundX,
    strike: Hammer
  };

  const { case: caseData }: { case: ModerationCase } = $props();
</script>

<AnchorRow>
  <div class="flex items-center gap-1 text-base">
    {#if caseData.type in icons}
      {@const Icon = icons[caseData.type as keyof typeof icons]}
      <Icon size={20} />
      <p class="capitalize">
        <strong>{caseData.type}</strong> - {new Date(caseData.time_created).toLocaleString()}
      </p>
    {/if}
  </div>

  <div class="mt-2 flex items-center gap-1">
    <img
      src={caseData.user_pfp}
      alt="{caseData.user_name}'s PFP"
      width="32"
      height="32"
      class="h-8 w-8 rounded-full"
    />
    <p class="font-semibold">{caseData.user_display} (@{caseData.user_name})</p>
  </div>
  <p class="text-base">{caseData.description}</p>
</AnchorRow>
