<script lang="ts">
  const {
    onclick,
    class: className = '',
    aria = '',
    children
  }: { onclick: () => void; class?: string; aria?: string; children: any } = $props();
</script>

<button
  class="flex w-fit cursor-pointer items-center gap-2 rounded-lg border-2 border-zinc-700 bg-zinc-800 p-2 px-4 transition-colors hover:bg-zinc-600 {className}"
  {onclick}
  aria-label={aria}
>
  {@render children?.()}
</button>
