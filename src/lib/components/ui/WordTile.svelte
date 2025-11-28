<script lang="ts">
  import { X } from '@lucide/svelte';

  let { word, deleteThis = () => {} }: { word: string; deleteThis: () => void } = $props();
</script>

<div class="flex items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base">
  <button class="cursor-pointer" onclick={deleteThis} aria-label="Delete word">
    <X size={16} />
  </button>
  <p>{word}</p>
</div>
