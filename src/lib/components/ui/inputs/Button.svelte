<script lang="ts">
  import type { Snippet } from 'svelte';

  const {
    onclick = () => {},
    type,
    class: className = '',
    border = true,
    smallPadding = false,
    aria = '',
    children
  }: {
    onclick?: () => void;
    type?: 'button' | 'submit' | 'reset' | null | undefined;
    class?: string;
    border?: boolean;
    smallPadding?: boolean;
    aria?: string;
    children: Snippet<[]>;
  } = $props();
</script>

<button
  class="flex w-fit cursor-pointer items-center gap-2 rounded-lg {border
    ? 'border-2 border-zinc-700'
    : 'border-0'} bg-zinc-800 {smallPadding ? 'p-1 px-4' : 'p-2 px-4'} transition-colors hover:bg-zinc-600 {className}"
  {onclick}
  {type}
  aria-label={aria}
>
  {@render children?.()}
</button>
