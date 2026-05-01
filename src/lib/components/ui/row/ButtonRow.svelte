<script lang="ts">
  import type { Component, Snippet } from 'svelte';

  let {
    children,
    class: className = '',
    label = '',
    Icon,
    thisElement = $bindable(),
    onclick
  }: {
    children?: Snippet<[]>;
    class?: string;
    label?: string;
    Icon?: Component;
    thisElement?: HTMLButtonElement;
    onclick?: (event: MouseEvent) => void;
  } = $props();
</script>

<button
  class={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4 text-left transition-colors hover:bg-zinc-700 ${className}`}
  bind:this={thisElement}
  {onclick}
  aria-label={label}
>
  <div class="w-full max-w-full">
    {@render children?.()}
  </div>

  {#if Icon}
    <Icon size={24} class="shrink-0" />
  {/if}
</button>
