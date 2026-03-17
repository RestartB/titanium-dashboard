<script lang="ts">
  import type { Component } from 'svelte';

  const { title, href, active, Icon }: { title: string; href: string; active: boolean; Icon: Component } = $props();
</script>

<a
  class="flex w-full items-center gap-2 rounded-xl p-2
  {!active ? 'hover:bg-zinc-800' : ''} {active ? 'bg-zinc-700' : ''}
  transition-all active:scale-98
  "
  {href}
>
  <Icon size={20} />
  <p>{title}</p>
</a>
