<script lang="ts">
  let {
    value = $bindable(),
    border = true,
    class: className = '',
    aria = ''
  }: {
    value?: string | null;
    border?: boolean;
    class?: string;
    aria?: string;
  } = $props();
</script>

<textarea
  class="flex w-full cursor-text items-center gap-2 min-h-17 rounded-lg {border
    ? 'border-2 border-zinc-600'
    : ''} bg-zinc-700 p-1 px-2 {className}"
  aria-label={aria}
  bind:value></textarea>
