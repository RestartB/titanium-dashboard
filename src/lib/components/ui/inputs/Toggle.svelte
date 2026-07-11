<script lang="ts">
  let { toggled = $bindable(false), class: className = '' }: { toggled?: boolean | null; class?: string } = $props();
</script>

<button
  class={`relative h-6 w-12 shrink-0 cursor-pointer rounded-full p-1 transition-colors ${toggled ? 'bg-green-500' : 'bg-zinc-500'} ${className}`}
  onclick={() => (toggled = !toggled)}
  aria-label="Toggle"
>
  <span class="block h-4 w-4 rounded-full bg-white transition-transform {toggled ? 'translate-x-6' : 'translate-x-0'}"
  ></span>
</button>
