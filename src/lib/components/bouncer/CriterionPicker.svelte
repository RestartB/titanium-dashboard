<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

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

<FullscreenOverlay title="Select a Criterion" padding={8} gap={8} bind:overlayOpen>
  {@render criterionRow('username', 'Username', "Watch for words in the user's username.", ALargeSmall)}
  {@render criterionRow('tag', 'Guild Tag', "Watch for words in the user's guild tag.", Tag)}
  {@render criterionRow('age', 'Account Age', "Watch for the age of the user's account.", Clock)}
  {@render criterionRow('avatar', 'Default Avatar', 'Watch if the user has a default avatar.', User)}
</FullscreenOverlay>
