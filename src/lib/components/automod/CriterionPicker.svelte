<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import { Smile, Paperclip, TextAlignStart, WholeWord, MessageCircle, Link, Dice5 } from '@lucide/svelte';

  import type { Component } from 'svelte';
  import type { AutomodCriterionSchema, AutomodRuleSchema } from '$lib/validators/automod';

  let { rule = $bindable(), overlayOpen = $bindable(true) }: { rule: AutomodRuleSchema; overlayOpen?: boolean } =
    $props();

  function createCriterion(type: AutomodCriterionSchema['type']): AutomodCriterionSchema {
    return {
      type: type,
      words: [],
      match_whole_word: true,
      match_all_words: false,
      case_sensitive: false
    };
  }

  const criteriaTypes: {
    id: AutomodCriterionSchema['type'];
    name: string;
    desc: string;
    icon: Component;
  }[] = [
    {
      id: 'word_list',
      name: 'Word List',
      desc: 'Watch for malicious links in the message content.',
      icon: WholeWord
    },
    {
      id: 'discord_dice_roll',
      name: 'Dice Roll Links',
      desc: 'Watch for Discord dice roll links.',
      icon: Dice5
    },
    {
      id: 'malicious_link',
      name: 'Malicious Links',
      desc: 'Watch for malicious links in the message content.',
      icon: Link
    },
    {
      id: 'phishing_link',
      name: 'Phishing Links',
      desc: 'Watch for phishing links in the message content.',
      icon: Link
    },
    {
      id: 'message_spam',
      name: 'Message Spam',
      desc: 'Monitor the amount of messages that users send.',
      icon: MessageCircle
    },
    {
      id: 'word_spam',
      name: 'Word Spam',
      desc: 'Monitor the amount of words that users send.',
      icon: WholeWord
    },
    {
      id: 'newline_spam',
      name: 'New Line Spam',
      desc: 'Monitor the amount of lines that users send.',
      icon: TextAlignStart
    },
    {
      id: 'link_spam',
      name: 'Link Spam',
      desc: 'Monitor the amount of links that users send.',
      icon: Link
    },
    {
      id: 'attachment_spam',
      name: 'Attachment Spam',
      desc: 'Monitor the amount of attachments that users send.',
      icon: Paperclip
    },
    {
      id: 'emoji_spam',
      name: 'Emoji Spam',
      desc: 'Monitor the amount of emojis that users send.',
      icon: Smile
    }
  ];
  let filteredTypes = $derived(
    criteriaTypes.filter((criteria) => !rule.criteria.map((ruleCriteria) => ruleCriteria.type).includes(criteria.id))
  );
</script>

{#snippet criterionRow(type: AutomodCriterionSchema['type'], name: string, description: string, Icon: Component)}
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
