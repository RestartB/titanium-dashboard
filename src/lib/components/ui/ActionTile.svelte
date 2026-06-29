<script lang="ts">
  import ActionPreferences from '$lib/components/ui/ActionPreferences.svelte';
  import { Cog, X } from '@lucide/svelte';

  import type { AutomodActionSchema } from '$lib/validators/automod';
  import type { BouncerActionSchema } from '$lib/validators/bouncer';
  import type { ServerInfo } from '$lib/interfaces/serverInfo';

  let {
    action = $bindable(),
    actionKind,
    serverInfo,
    deleteThis = () => {},
    overlayOpen = $bindable(false)
  }: {
    action: AutomodActionSchema | BouncerActionSchema;
    actionKind: 'automod' | 'bouncer';
    serverInfo: ServerInfo;
    deleteThis: () => void;
    overlayOpen?: boolean;
  } = $props();
</script>

{#if overlayOpen}
  <ActionPreferences {actionKind} {serverInfo} bind:action bind:overlayOpen />
{/if}

<div class="flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base">
  {#if action.type !== 'delete'}
    <button onclick={() => (overlayOpen = true)} class="cursor-pointer" aria-label="Open action preferences">
      <Cog size={16} />
    </button>
  {/if}
  <button onclick={deleteThis} class="cursor-pointer" aria-label="Delete action">
    <X size={16} />
  </button>
  <p class="capitalize">{action.type.replaceAll('_', ' ')}</p>
</div>
