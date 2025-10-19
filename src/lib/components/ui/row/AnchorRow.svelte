<script lang="ts">
  import type { Component } from 'svelte';

  let {
    children,
    class: className = '',
    href = '#',
    title = '',
    Icon,
    thisElement = $bindable()
  }: {
    children?: any;
    class?: string;
    href?: string;
    title?: string;
    Icon?: Component;
    thisElement?: HTMLAnchorElement;
  } = $props();
</script>

<a
  class={`flex w-full items-center justify-between gap-2 rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4 text-left transition-colors hover:bg-zinc-700 ${className}`}
  {title}
  {href}
  bind:this={thisElement}
>
  <div>
    {@render children?.()}
  </div>

  {#if Icon}
    <Icon size={24} class="flex-shrink-0" />
  {/if}
</a>
