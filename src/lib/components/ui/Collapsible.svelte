<script lang="ts">
  import { ChevronDown } from '@lucide/svelte';
  const {
    children,
    title,
    defaultState = false
  }: { children: any; title: string; defaultState?: boolean } = $props();
  let isOpen = $state(defaultState);
</script>

<div class="w-full">
  <button
    class="flex w-full cursor-pointer items-center justify-between py-1"
    onclick={() => (isOpen = !isOpen)}
  >
    <h3 class="font-bold">{title}</h3>
    <ChevronDown
      class="flex-shrink-0 transition-transform duration-300 {isOpen ? 'rotate-180' : ''}"
    />
  </button>
  <div
    class="grid transition-all duration-300 ease-in-out {isOpen
      ? 'grid-rows-[1fr]'
      : 'grid-rows-[0fr]'}"
  >
    <div class="overflow-hidden">
      <div class="mt-2">
        {@render children()}
      </div>
    </div>
  </div>
</div>
