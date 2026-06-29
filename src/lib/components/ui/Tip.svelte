<script lang="ts">
  import { Info } from '@lucide/svelte';
  const { children, class: className = '' } = $props();
</script>

<div class="flex items-center gap-4 rounded-xl border-2 border-zinc-700 bg-zinc-600 p-4 {className}">
  <Info size={20} class="shrink-0" />
  {@render children?.()}
</div>
