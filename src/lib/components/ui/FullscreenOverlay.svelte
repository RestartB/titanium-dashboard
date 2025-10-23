<script lang="ts">
  import { fade } from 'svelte/transition';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let { children, overlayOpen = $bindable(false) }: { children?: any; overlayOpen?: boolean } =
    $props();
</script>

<div
  class="fixed inset-0 isolate z-50 mt-12 flex flex-col items-center justify-center overflow-hidden bg-white/60 p-4 backdrop-blur-lg dark:bg-black/60"
  transition:fade={{ duration: 100 }}
>
  <div
    class="absolute inset-0 -z-10"
    onclick={() => (overlayOpen = false)}
    aria-hidden="true"
  ></div>
  {@render children?.()}
</div>
