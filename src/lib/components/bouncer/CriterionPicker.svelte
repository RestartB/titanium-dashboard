<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

  import { ALargeSmall, Tag, Clock, User } from '@lucide/svelte';
  import type { Component } from 'svelte';
  import type { BouncerCriterionSchema, BouncerRuleSchema } from '$lib/validators/bouncer';

  let { rule = $bindable(), overlayOpen = $bindable(true) }: { rule: BouncerRuleSchema; overlayOpen?: boolean } =
    $props();

  function createCriterion(type: BouncerCriterionSchema['type']): BouncerCriterionSchema {
    return {
      type: type,
      words: [],
      match_whole_word: true,
      match_all_words: false,
      case_sensitive: false
    };
  }

  const criteriaTypes: {
    id: BouncerCriterionSchema['type'];
    name: string;
    desc: string;
    icon: Component;
  }[] = [
    {
      id: 'username',
      name: 'Username',
      desc: "Watch for words in the user's username.",
      icon: ALargeSmall
    },
    {
      id: 'tag',
      name: 'Guild Tag',
      desc: "Watch for words in the user's guild tag.",
      icon: Tag
    },
    {
      id: 'age',
      name: 'Account Age',
      desc: "Watch for the age of the user's account.",
      icon: Clock
    },
    {
      id: 'avatar',
      name: 'Default Avatar',
      desc: 'Watch if the user has a default avatar.',
      icon: User
    }
  ];
  let filteredTypes = $derived(
    criteriaTypes.filter((criteria) => !rule.criteria.map((ruleCriteria) => ruleCriteria.type).includes(criteria.id))
  );
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
  {#if filteredTypes.length === 0}
    <p class="m-2 mx-auto text-lg text-zinc-400">Nothing to show</p>
  {:else}
    {#each filteredTypes as criterionType (criterionType.id)}
      {@render criterionRow(criterionType.id, criterionType.name, criterionType.desc, criterionType.icon)}
    {/each}
  {/if}
</FullscreenOverlay>
