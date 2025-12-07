<script lang="ts">
  const {
    onclick,
    class: className = '',
    border = true,
    aria = '',
    children
  }: { onclick: () => void; class?: string; border?: boolean; aria?: string; children: any } = $props();
</script>

<button
  class="flex w-fit cursor-pointer items-center gap-2 rounded-lg {border
    ? 'border-2 border-zinc-700'
    : 'border-0'} bg-zinc-800 p-2 px-4 transition-colors hover:bg-zinc-600 {className}"
  {onclick}
  aria-label={aria}
>
  {@render children?.()}
</button>
