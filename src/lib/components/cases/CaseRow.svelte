<script lang="ts">
  import { Tooltip } from 'flowbite-svelte';
  import { TriangleAlert, VolumeOff, UserRoundX, Hammer } from '@lucide/svelte';

  import type { ModerationCase } from '$lib/interfaces/moderation';

  const icons = {
    warn: TriangleAlert,
    mute: VolumeOff,
    kick: UserRoundX,
    ban: Hammer
  };

  const { case: caseData, guild }: { case: ModerationCase; guild: string } = $props();
</script>

<li>
  <a href={`/guild/${guild}/moderation/cases/${caseData.id}`}>
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        {#if caseData.resolved}
          <span class="block h-4 w-4 rounded-full bg-green-500"></span>
        {:else}
          <span class="relative block h-4 w-4">
            <span class="absolute top-0 left-0 block h-4 w-4 rounded-full bg-red-500"></span>
            <span class="absolute top-0 left-0 block h-4 w-4 animate-slow-ping rounded-full bg-red-500 duration-3000"
            ></span>
          </span>
        {/if}
        <Tooltip type="dark" class="border-2 border-zinc-700 bg-zinc-800 p-2 px-4">
          {caseData.resolved ? 'Resolved' : 'Open'}
        </Tooltip>

        <p class="text-base text-zinc-300">
          {#if caseData.type in icons}
            {@const Icon = icons[caseData.type as keyof typeof icons]}
            <Icon class="inline-block h-5 w-5 align-middle" size={20} />
          {/if}
          <strong>{caseData.type.toLocaleUpperCase()}</strong> by
          <img
            src={caseData.creator_pfp}
            alt="{caseData.creator_name}'s PFP"
            width="20"
            height="20"
            class="inline-block h-5 w-5 rounded-full align-middle"
          />
          @{caseData.creator_name}{caseData.creator_discrim ? `#${caseData.creator_discrim}` : ''} - {new Date(
            caseData.time_created
          ).toLocaleString()}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <img
          src={caseData.user_pfp}
          alt="{caseData.user_name}'s PFP"
          width="32"
          height="32"
          class="h-8 w-8 rounded-full"
        />
        <div>
          <p class="font-semibold">
            {caseData.user_display} (@{caseData.user_name}{caseData.user_discrim ? `#${caseData.user_discrim}` : ''})
          </p>
          <p class="font-mono text-sm text-zinc-300">{caseData.user_id}</p>
        </div>
      </div>

      <p class:opacity-80={!caseData.description}>{caseData.description || 'No description provided.'}</p>
    </div>
  </a>
</li>
