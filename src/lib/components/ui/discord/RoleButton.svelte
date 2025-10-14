<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import type { RoleInfo } from '$lib/types/serverInfo';

  let overlayOpen = $state(false);

  let {
    roles = [],
    role = $bindable()
  }: {
    roles?: RoleInfo[];
    role?: string;
  } = $props();

  const selectedRole = $derived.by(() => {
    return roles.find((r) => r.id === role);
  });
</script>

{#if overlayOpen}
  <FullscreenOverlay bind:overlayOpen>
    <RolePicker {roles} bind:selectedRole={role} bind:overlayOpen />
  </FullscreenOverlay>
{/if}

{#snippet roleContent()}
  {#if selectedRole}
    {#if selectedRole.color}
      <span
        class="h-4 w-4 flex-shrink-0 rounded-full"
        style="background-color: {selectedRole.color === '#000000'
          ? '#99A9B5'
          : selectedRole.color}"
      ></span>
    {/if}
    <p class="text-zinc-200 select-none">{selectedRole.name}</p>
  {:else}
    <p class="text-zinc-500 select-none">No role set</p>
  {/if}
{/snippet}

<button
  class="flex w-fit flex-shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-zinc-800 p-1 px-2 transition-colors hover:bg-zinc-600"
  onclick={() => (overlayOpen = !overlayOpen)}
>
  {@render roleContent()}
</button>
