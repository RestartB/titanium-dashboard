<script lang="ts">
  let { toggled = $bindable(false) } = $props();
</script>

<button
  class={`border-box flex h-6 min-w-12 flex-shrink-0 cursor-pointer rounded-full p-1 transition-all ${toggled ? 'bg-green-500' : 'bg-zinc-500'}`}
  onclick={() => (toggled = !toggled)}
  aria-label="Toggle"
>
  <span
    class="aspect-square h-4 w-4 rounded-full bg-white transition-all"
    style="margin-left: {toggled ? 'calc(100% - 1rem)' : '0'}"
  ></span>
</button>
