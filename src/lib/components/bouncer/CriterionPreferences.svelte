<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import LimitPill from '$lib/components/ui/LimitPill.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import Duration from '$lib/components/ui/inputs/Duration.svelte';
  import WordTile from '$lib/components/ui/WordTile.svelte';
  import { Plus } from '@lucide/svelte';

  import type { BouncerCriterionSchema } from '$lib/validators/bouncer';

  let {
    criterion = $bindable(),
    limit,
    enforcingLimit,
    overlayOpen = $bindable(true)
  }: { criterion: BouncerCriterionSchema; limit: number; enforcingLimit: boolean; overlayOpen?: boolean } = $props();

  let newWordInput = $state('');
</script>

<FullscreenOverlay title="Set Preferences" padding={16} gap={16} bind:overlayOpen>
  {#if criterion.type === 'username' || criterion.type === 'tag'}
    <div class="w-full text-left">
      <p class="font-medium">Words</p>
      <p class="mb-2 text-sm text-zinc-400">Enter the words or phrases to match.</p>

      {#if enforcingLimit}
        <LimitPill amount={criterion.words?.length || 0} {limit} />
      {/if}

      <div class="mt-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-800 p-2">
        <div
          class="flex max-w-40 items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
          class:opacity-50={enforcingLimit && (criterion.words?.length || 0) >= limit}
          class:cursor-not-allowed={enforcingLimit && (criterion.words?.length || 0) >= limit}
        >
          <input
            type="text"
            placeholder="Add Word..."
            class="h-full w-full"
            disabled={enforcingLimit && (criterion.words?.length || 0) >= limit}
            onkeydown={(e) => {
              if (e.key === 'Enter' && newWordInput) {
                criterion.words?.push(newWordInput);
                newWordInput = '';
              }
            }}
            bind:value={newWordInput}
          />
          <button
            class="cursor-pointer rounded-lg p-1 transition-colors hover:bg-zinc-600"
            disabled={enforcingLimit && (criterion.words?.length || 0) >= limit}
            onclick={() => {
              if (newWordInput) {
                criterion.words?.push(newWordInput);
                newWordInput = '';
              }
            }}
            aria-label="Add word"
          >
            <Plus size={16} />
          </button>
        </div>
        {#if criterion.words}
          {#each criterion.words as word, index (index)}
            <WordTile deleteThis={() => criterion.words?.splice(index, 1)} {word} />
          {/each}
        {/if}
      </div>

      <div class="mt-2 flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-2">
          <Toggle bind:toggled={criterion.match_whole_word} />
          <p class="text-sm text-zinc-300/60">Match Whole Word</p>
        </div>

        <div class="flex items-center gap-2">
          <Toggle bind:toggled={criterion.case_sensitive} />
          <p class="text-sm text-zinc-300/60">Case Sensitive</p>
        </div>
      </div>
    </div>
  {:else if criterion.type === 'age'}
    <div class="w-full text-left">
      <p class="font-medium">Minimum Age</p>
      <p class="mb-2 text-sm text-zinc-400">
        Set account age requirement (e.g., 1d5h30m). If the account is younger than this duration, the criterion will
        match.
      </p>
      <Duration class="w-full p-2" border={false} bind:seconds={criterion.account_age} />
    </div>
  {/if}
</FullscreenOverlay>
