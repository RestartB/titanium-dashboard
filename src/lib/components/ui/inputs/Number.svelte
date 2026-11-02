<script lang="ts">
  let {
    value = $bindable(),
    min = undefined,
    max = undefined,
    integer = true,
    border = true,
    class: className = '',
    aria = ''
  }: {
    value?: number | null;
    min?: number;
    max?: number;
    integer?: boolean;
    border?: boolean;
    class?: string;
    aria?: string;
  } = $props();

  // only allow numbers and decimals
  function processNumber(inputValue: string) {
    let numericValue;
    if (integer) {
      numericValue = Number(inputValue.replace(/[^\d-]/g, ''));
    } else {
      const normalized = inputValue.replace(/,/g, '.').replace(/[^\d.-]/g, '');
      numericValue = Number(normalized);
    }

    if (!Number.isFinite(numericValue)) {
      numericValue = 0;
    }

    if (min !== undefined) numericValue = Math.max(min, numericValue);
    if (max !== undefined) numericValue = Math.min(max, numericValue);

    value = numericValue;
  }
</script>

<input
  type="text"
  class="flex cursor-text items-center gap-2 rounded-lg {border
    ? 'border-2 border-zinc-700'
    : ''} bg-zinc-800 p-1 px-2 transition-colors focus:bg-zinc-600 {className}"
  aria-label={aria}
  value={value ?? ''}
  oninput={(event) => processNumber(event.currentTarget.value)}
  onfocusout={(event) => {
    processNumber(event.currentTarget.value);
    event.currentTarget.value = String(value);
  }}
/>
