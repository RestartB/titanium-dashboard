<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

  import Fuse from 'fuse.js';
  import type { RoleInfo } from '$lib/interfaces/serverInfo';

  let {
    roles,
    selectedRole = $bindable(),
    overlayOpen = $bindable(false)
  }: {
    roles: RoleInfo[];
    selectedRole?: string | null;
    overlayOpen?: boolean;
  } = $props();

  let searchInput = $state('');

  const fuse = $derived(
    new Fuse(roles, {
      keys: ['name', 'id'],
      threshold: 0.3
    })
  );

  function getFilteredRoles(query: string): RoleInfo[] {
    if (!query) return roles;

    const lowercasedQuery = query.toLowerCase();
    return fuse.search(lowercasedQuery).map((result) => result.item);
  }

  let filteredRoles = $derived(getFilteredRoles(searchInput));
</script>

{#snippet roleRow(role: RoleInfo)}
  <button
    class="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-zinc-800 p-1 px-2 hover:bg-zinc-600"
    onclick={() => {
      selectedRole = role.id;
      overlayOpen = false;
    }}
    aria-label="Select {role.name} role"
  >
    {#if role.colour}
      <span
        class="h-4 w-4 shrink-0 rounded-full"
        style="background-color: {role.colour === '#000000' ? '#99A9B5' : role.colour}"
      ></span>
    {/if}
    <p class="text-left text-zinc-200 select-none">{role.name}</p>
  </button>
{/snippet}

<FullscreenOverlay bind:overlayOpen title="Select a Role" zIndex={60}>
  <div class="flex h-fit w-full shrink-0 flex-col gap-2 border-b-2 border-zinc-600 p-2">
    <input
      type="text"
      placeholder="Search roles..."
      class="w-full rounded-md border-2 border-zinc-600 bg-zinc-800 p-2 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
      bind:value={searchInput}
    />
  </div>

  <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
    {#each filteredRoles as role (role.id)}
      {@render roleRow(role)}
    {/each}
  </div>
</FullscreenOverlay>
