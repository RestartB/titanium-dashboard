<script lang="ts">
  import { hasDiscordPermission } from '$lib/helpers/discord';

  import Collapsible from '$lib/components/ui/Collapsible.svelte';
  import Row from '$lib/components/ui/row/Row.svelte';
  import { Check, CircleAlert } from '@lucide/svelte';

  import type { Snippet } from 'svelte';

  const { children, permissions, allRequired }: { children?: Snippet; permissions: bigint; allRequired: bigint } =
    $props();
</script>

{#snippet topRow()}
  <div class="flex flex-wrap items-center justify-between w-full gap-2">
    <div class="text-start">
      <h3 class="text-xl font-bold">Permission Assistant</h3>
      <p>View all bot permissions this feature requires.</p>
    </div>

    <div
      class="flex items-center justify-center gap-2 rounded-full border-2 border-zinc-600 bg-zinc-700 p-1 px-4"
    >
      {#if hasDiscordPermission(permissions, allRequired)}
        <Check class="text-green-300" />
        <p>All good</p>
      {:else}
        <CircleAlert class="text-red-300" />
        <p>Warning</p>
      {/if}
    </div>
  </div>
{/snippet}

<Row>
  <Collapsible {topRow} class="space-y-4">
    <hr class="text-zinc-600" />
    {@render children?.()}
  </Collapsible>
</Row>
