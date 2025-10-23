<script lang="ts">
  import type { Component } from 'svelte';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let {
    children,
    class: className = '',
    Icon,
    thisElement = $bindable(),
    onclick
  }: {
    children?: any;
    class?: string;
    Icon?: Component;
    thisElement?: HTMLButtonElement;
    onclick?: (event: MouseEvent) => void;
  } = $props();
</script>

<button
  class={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4 text-left transition-colors hover:bg-zinc-700 ${className}`}
  bind:this={thisElement}
  {onclick}
>
  <div>
    {@render children?.()}
  </div>

  {#if Icon}
    <Icon size={24} class="flex-shrink-0" />
  {/if}
</button>
