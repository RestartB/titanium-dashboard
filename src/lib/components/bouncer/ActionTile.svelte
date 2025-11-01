<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import ActionPreferences from '$lib/components/automod/ActionPreferences.svelte';
  import { Cog, X } from '@lucide/svelte';
  import type { AutomodAction } from '$lib/interfaces/automod';
  import type { RoleInfo } from '$lib/interfaces/serverInfo';

  let {
    action = $bindable(),
    roles,
    deleteThis = () => {},
    overlayOpen = $bindable(false)
  }: {
    action: AutomodAction;
    roles: RoleInfo[];
    deleteThis: () => void;
    overlayOpen?: boolean;
  } = $props();
</script>

{#if overlayOpen}
  <FullscreenOverlay bind:overlayOpen>
    <ActionPreferences {roles} bind:action bind:overlayOpen />
  </FullscreenOverlay>
{/if}

<div
  class="flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
>
  {#if action.type !== 'delete'}
    <button onclick={() => (overlayOpen = true)} aria-label="Open action preferences">
      <Cog size={16} />
    </button>
  {/if}
  <button onclick={deleteThis} aria-label="Delete action">
    <X size={16} />
  </button>
  <p class="capitalize">{action.type.replaceAll('_', ' ')}</p>
</div>
