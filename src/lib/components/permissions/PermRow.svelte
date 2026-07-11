<script lang="ts">
  import { hasDiscordPermission } from '$lib/helpers/discord';
  import { Check, X } from '@lucide/svelte';

  const {
    permissions,
    required,
    title,
    description
  }: { permissions: bigint; required: bigint; title: string; description: string } = $props();
</script>

<div class="space-y-2 border-zinc-600 not-last:border-b not-last:pb-2">
  <div
    class="flex items-center gap-2"
    class:text-green-300={hasDiscordPermission(permissions, required)}
    class:text-red-300={!hasDiscordPermission(permissions, required)}
  >
    {#if hasDiscordPermission(permissions, required)}
      <Check />
    {:else}
      <X />
    {/if}
    <p class="font-bold">{title}</p>
  </div>
  <p>{description}</p>
</div>
