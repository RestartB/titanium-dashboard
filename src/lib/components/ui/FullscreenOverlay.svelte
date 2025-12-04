<script lang="ts">
  import { fade } from 'svelte/transition';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let {
    children,
    class: className = '',
    overlayOpen = $bindable(false)
  }: { children?: any; class?: string; overlayOpen?: boolean } = $props();
</script>

<div
  class="fixed inset-0 isolate z-50 mt-12 flex flex-col items-center justify-center overflow-hidden bg-black/60 p-4 backdrop-blur-lg {className}"
  transition:fade={{ duration: 100 }}
>
  <div class="absolute inset-0 -z-10" onclick={() => (overlayOpen = false)} aria-hidden="true"></div>
  {@render children?.()}
</div>
