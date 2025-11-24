<script lang="ts">
  let {
    value = $bindable(),
    integer = true,
    class: className = '',
    aria = ''
  }: { value?: number; integer?: boolean; class?: string; aria?: string } = $props();

  // only allow numbers and decimals
  function processNumber(event: Event) {
    const input = event.target as HTMLInputElement;

    let numericValue;
    if (integer) {
      numericValue = Number(input.value.replace(/\D/g, ''));
    } else {
      const normalized = input.value.replace(/,/g, '.').replace(/[^\d.]/g, '');
      numericValue = Number(normalized);
    }

    if (isNaN(numericValue)) {
      value = 0;
    } else {
      value = numericValue;
    }
  }
</script>

<input
  type="text"
  class="flex w-fit cursor-text items-center gap-2 rounded-lg border-2 border-zinc-700 bg-zinc-800 p-1 px-2 transition-colors focus:bg-zinc-600 {className}"
  aria-label={aria}
  bind:value
  onfocusout={processNumber}
/>
