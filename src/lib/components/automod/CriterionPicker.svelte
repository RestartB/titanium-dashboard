<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import { Smile, Paperclip, TextAlignStart, WholeWord, MessageCircle, Link } from '@lucide/svelte';

  import type { Component } from 'svelte';
  import type { AutomodCriterionSchema, AutomodRuleSchema } from '$lib/validators/automod';

  let { rule = $bindable(), overlayOpen = $bindable(true) }: { rule: AutomodRuleSchema; overlayOpen?: boolean } =
    $props();

  function createCriterion(type: AutomodCriterionSchema['type']): AutomodCriterionSchema {
    return {
      type: type,
      words: [],
      match_whole_word: false,
      match_all_words: false,
      case_sensitive: false
    };
  }
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
  {@render criterionRow('word_list', 'Word List', 'Watch for words in the message content.', WholeWord)}
  {@render criterionRow('malicious_link', 'Malicious Links', 'Watch for malicious links in the message content.', Link)}
  {@render criterionRow('phishing_link', 'Phishing Links', 'Watch for phishing links in the message content.', Link)}
  <!-- prettier-ignore -->
  {@render criterionRow('message_spam', 'Message Spam', 'Monitor the amount of messages that users send.', MessageCircle)}
  {@render criterionRow('word_spam', 'Word Spam', 'Monitor the amount of words that users send.', WholeWord)}
  <!-- prettier-ignore -->
  {@render criterionRow('newline_spam', 'New Line Spam', 'Monitor the amount of lines that users send.', TextAlignStart)}
  <!-- prettier-ignore -->
  {@render criterionRow('attachment_spam', 'Attachment Spam', 'Monitor the amount of attachments that users send.', Paperclip)}
  {@render criterionRow('emoji_spam', 'Emoji Spam', 'Monitor the amount of emojis that users send.', Smile)}
</FullscreenOverlay>
