<script lang="ts">
  import { X } from '@lucide/svelte';

  let {
    type,
    deleteThis = () => {}
  }: {
    type: string;
    deleteThis: () => void;
  } = $props();
</script>

<div class="flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base">
  <button onclick={deleteThis} aria-label="Delete trigger" class="cursor-pointer">
    <X size={16} />
  </button>
  <p>{type}</p>
</div>
