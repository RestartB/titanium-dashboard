<script lang="ts">
  import AnchorRow from '$lib/components/ui/row/AnchorRow.svelte';
  import { TriangleAlert, VolumeOff, UserRoundX, Hammer } from '@lucide/svelte';
  import type { ModerationCase } from '$lib/interfaces/moderation';

  const icons = {
    warn: TriangleAlert,
    mute: VolumeOff,
    kick: UserRoundX,
    ban: Hammer
  };

  const { case: caseData }: { case: ModerationCase } = $props();
</script>

<li>
  <div>
    {#if caseData.type in icons}
      {@const Icon = icons[caseData.type as keyof typeof icons]}
      <p class="text-base text-zinc-300">
        <Icon class="inline-block h-5 w-5" size={20} />
        <strong>{caseData.type.toLocaleUpperCase()}</strong>
        {new Date(caseData.time_created).toLocaleString()} by
        <img
          src={caseData.creator_pfp}
          alt="{caseData.creator_name}'s PFP"
          width="20"
          height="20"
          class="inline-block h-5 w-5 rounded-full"
        />
        @{caseData.creator_name}
      </p>
    {/if}

    <div class="mt-1 flex items-center gap-2">
      <img
        src={caseData.user_pfp}
        alt="{caseData.user_name}'s PFP"
        width="32"
        height="32"
        class="h-8 w-8 rounded-full"
      />
      <div>
        <p class="font-semibold">{caseData.user_display} (@{caseData.user_name})</p>
        <p class="font-mono text-sm text-zinc-300">{caseData.user_id}</p>
      </div>
    </div>
    <p class="mt-1">{caseData.description || 'No description provided.'}</p>
  </div>
</li>
