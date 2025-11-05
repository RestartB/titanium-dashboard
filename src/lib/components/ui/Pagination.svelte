<script lang="ts">
  import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from '@lucide/svelte';

  const {
    currentPage = $bindable(),
    pageCount,
    changePage
  }: { currentPage: number; pageCount: number; changePage: (page: number) => void } = $props();
</script>

{#if pageCount > 1}
  <div class="flex w-full items-center justify-center gap-2">
    <button
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-200 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={currentPage === 1}
      onclick={() => changePage(1)}
      aria-label="First Page"
    >
      <ChevronFirst class="h-5 w-5" />
    </button>
    <button
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-200 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={currentPage === 1}
      onclick={() => changePage(currentPage - 1)}
      aria-label="Previous Page"
    >
      <ChevronLeft class="h-5 w-5" />
    </button>
    <p class="text-zinc-400">Page {currentPage} of {pageCount}</p>
    <button
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-200 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={currentPage === pageCount}
      onclick={() => changePage(currentPage + 1)}
      aria-label="Next Page"
    >
      <ChevronRight class="h-5 w-5" />
    </button>
    <button
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-200 hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={currentPage === pageCount}
      onclick={() => changePage(pageCount)}
      aria-label="Last Page"
    >
      <ChevronLast class="h-5 w-5" />
    </button>
  </div>
{/if}
