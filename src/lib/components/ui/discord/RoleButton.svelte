<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import type { RoleInfo } from '$lib/interfaces/serverInfo';

  let overlayOpen = $state(false);

  let {
    roles = [],
    role = $bindable(),
    class: className = ''
  }: {
    roles?: RoleInfo[];
    role?: string | null;
    class?: string;
  } = $props();

  const selectedRole = $derived.by(() => {
    return roles.find((r) => r.id === role);
  });
</script>

{#if overlayOpen}
  <RolePicker {roles} bind:selectedRole={role} bind:overlayOpen />
{/if}

{#snippet roleContent()}
  {#if selectedRole}
    {#if selectedRole.color}
      <span
        class="h-4 w-4 shrink-0 rounded-full"
        style="background-color: {selectedRole.color === '#000000' ? '#99A9B5' : selectedRole.color}"
      ></span>
    {/if}
    <p class="text-zinc-200 select-none">{selectedRole.name}</p>
  {:else}
    <p class="text-zinc-500 select-none">No role set</p>
  {/if}
{/snippet}

<button
  class="flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-zinc-700 p-1 px-2 transition-colors hover:bg-zinc-600 {className}"
  onclick={() => (overlayOpen = !overlayOpen)}
  aria-label="Toggle role selector"
>
  {@render roleContent()}
</button>
