<script lang="ts">
  import { X } from '@lucide/svelte';

  import Fuse from 'fuse.js';
  import type { RoleInfo } from '$lib/interfaces/serverInfo';

  let {
    roles,
    selectedRole = $bindable(),
    overlayOpen = $bindable(false)
  }: {
    roles: RoleInfo[];
    selectedRole?: string;
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
    {#if role.color}
      <span
        class="h-4 w-4 flex-shrink-0 rounded-full"
        style="background-color: {role.color === '#000000' ? '#99A9B5' : role.color}"
      ></span>
    {/if}
    <p class="text-zinc-200 select-none">{role.name}</p>
  </button>
{/snippet}

<div
  class="flex w-full max-w-104 flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
>
  <div class="flex w-full items-center justify-between gap-2">
    <h2 class="text-xl font-bold">Select a Role</h2>
    <button
      class="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
      onclick={() => (overlayOpen = false)}
      aria-label="Close role selector"
    >
      <X class="h-6 w-6" />
    </button>
  </div>
  <div
    class="flex h-full max-h-[30rem] min-h-[30rem] w-full max-w-96 flex-shrink-0 flex-col rounded-xl border-2 border-zinc-600 bg-zinc-700"
  >
    <div class="flex h-fit w-full flex-shrink-0 flex-col gap-2 border-b-2 border-zinc-600 p-2">
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
  </div>
</div>
