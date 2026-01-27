<script lang="ts">
  import { X } from '@lucide/svelte';
  import type { RoleInfo } from '$lib/interfaces/serverInfo';

  let { role, deleteThis = () => {} }: { role: RoleInfo; deleteThis: () => void } = $props();
</script>

<div class="flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-700 bg-zinc-800 p-1 px-2 text-base">
  <button class="cursor-pointer" onclick={deleteThis} aria-label="Remove role">
    <X size={16} />
  </button>

  {#if role.colour}
    <span
      class="h-4 w-4 shrink-0 rounded-full"
      style="background-color: {role.colour === '#000000' ? '#99A9B5' : role.colour}"
    ></span>
  {/if}

  <p class="text-zinc-200 select-none">{role.name}</p>
</div>
