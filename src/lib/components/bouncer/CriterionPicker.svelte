<script lang="ts">
  import { scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  import { ALargeSmall, Tag, Clock, User, X } from '@lucide/svelte';
  import type { Component } from 'svelte';
  import type { BouncerCriterionSchema, BouncerRuleSchema } from '$lib/validators/bouncer';

  let { rule = $bindable(), overlayOpen = $bindable(true) }: { rule: BouncerRuleSchema; overlayOpen?: boolean } =
    $props();

  function createCriterion(type: BouncerCriterionSchema['type']): BouncerCriterionSchema {
    return {
      type: type,
      words: [],
      match_whole_word: false,
      case_sensitive: false
    };
  }
</script>

{#snippet criterionRow(type: BouncerCriterionSchema['type'], name: string, description: string, Icon: Component)}
  <button
    class="flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 px-4 transition-all hover:bg-zinc-800"
    onclick={() => {
      const criterion = createCriterion(type);
      rule.criteria = [...(rule.criteria || []), criterion];
      overlayOpen = false;
    }}
    aria-label="Select {name} criterion"
  >
    <Icon size={24} />
    <div class="w-full text-left">
      <p class="font-medium">{name}</p>
      <p class="text-sm text-zinc-400">{description}</p>
    </div>
  </button>
{/snippet}

<div
  class="flex w-full max-w-104 flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
  transition:scale={{ duration: 300, easing: cubicOut, start: 0.9, opacity: 1 }}
>
  <div class="flex w-full items-center justify-between gap-2">
    <h2 class="text-xl font-bold">Select a Criteria Type</h2>
    <button
      class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
      onclick={() => (overlayOpen = false)}
      aria-label="Close criterion selector"
    >
      <X class="h-6 w-6" />
    </button>
  </div>
  <div
    class="flex h-full max-h-104 min-h-104 w-full max-w-96 shrink-0 flex-col rounded-xl border-2 border-zinc-600 bg-zinc-700"
  >
    <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
      {@render criterionRow('username', 'Username', "Watch for words in the user's username.", ALargeSmall)}
      {@render criterionRow('tag', 'Guild Tag', "Watch for words in the user's guild tag.", Tag)}
      {@render criterionRow('age', 'Account Age', "Watch for the age of the user's account.", Clock)}
      {@render criterionRow('avatar', 'Default Avatar', 'Watch if the user has a default avatar.', User)}
    </div>
  </div>
</div>
