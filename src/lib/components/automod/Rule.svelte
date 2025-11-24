<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import ActionPicker from '$lib/components/pickers/ActionPicker.svelte';
  import ActionTile from '$lib/components/ui/ActionTile.svelte';
  import WordTile from '$lib/components/ui/WordTile.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';

  import { ChevronDown, X, Plus } from '@lucide/svelte';
  import type { AutomodRuleSchema } from '$lib/validators/automod';
  import type { RoleInfo } from '$lib/interfaces/serverInfo';

  let {
    roles,
    rule = $bindable(),
    deleteThis
  }: { roles: RoleInfo[]; rule: AutomodRuleSchema; deleteThis: () => void } = $props();
  let expanded = $state(false);
  let createNewOpen = $state(false);

  const thresholdStrings = {
    badword_detection: 'flagged words',
    malicious_link: 'flagged links',
    phishing_link: 'flagged links',
    message_spam: 'messages',
    mention_spam: 'mentions',
    word_spam: 'words',
    newline_spam: 'new lines',
    link_spam: 'links',
    attachment_spam: 'attachments',
    emoji_spam: 'emojis'
  };

  let thresholdString = $state('');
  if (rule.rule_type === 'spam_detection') {
    thresholdString = thresholdStrings[rule.antispam_type as keyof typeof thresholdStrings] || 'messages';
  } else {
    thresholdString = thresholdStrings[rule.rule_type as keyof typeof thresholdStrings] || 'messages';
  }

  let newWordInput = $state('');

  $effect(() => {
    if (String(rule.threshold).trim() === '') {
      return;
    }

    const numValue = Number(rule.threshold);
    if (isNaN(numValue)) {
      rule.threshold = 5;
      return;
    }
    if (numValue < 1) {
      rule.threshold = 1;
    }
  });

  $effect(() => {
    if (String(rule.duration).trim() === '') {
      return;
    }

    const numValue = Number(rule.duration);
    if (isNaN(numValue)) {
      rule.duration = 5;
      return;
    }
    if (numValue < 1) {
      rule.duration = 1;
    }
  });
</script>

{#if createNewOpen}
  <FullscreenOverlay bind:overlayOpen={createNewOpen}>
    <ActionPicker type="automod" bind:rule bind:overlayOpen={createNewOpen} />
  </FullscreenOverlay>
{/if}

<div class="w-full rounded-lg border-2 border-zinc-800 bg-zinc-700 p-2">
  <div class="flex w-full items-center justify-between gap-2">
    <span class="text-base">
      <input
        type="text"
        class="inline w-10 shrink-0 rounded-lg border-2 border-zinc-700 bg-zinc-800 p-1 px-1 text-center font-mono"
        bind:value={rule.threshold}
        onfocusout={() => {
          if (String(rule.threshold).trim() === '') {
            rule.threshold = 1;
          }
        }}
      />
      {thresholdString} in
      <input
        type="text"
        class="inline w-10 shrink-0 rounded-lg border-2 border-zinc-700 bg-zinc-800 p-1 px-1 text-center font-mono"
        bind:value={rule.duration}
        onfocusout={() => {
          if (String(rule.duration).trim() === '') {
            rule.duration = 1;
          }
        }}
      />
      seconds
    </span>
    <div class="flex items-center justify-center gap-2">
      <button
        class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-zinc-800 transition-colors hover:bg-zinc-600"
        aria-label="Delete rule"
        onclick={deleteThis}
      >
        <X size={18} />
      </button>
      <button
        class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-zinc-800 transition-colors hover:bg-zinc-600"
        aria-label="Expand rule details"
        onclick={() => (expanded = !expanded)}
      >
        <ChevronDown size={18} class={`transition-transform duration-200 ${expanded ? 'rotate-180' : 'rotate-0'}`} />
      </button>
    </div>
  </div>
  <div
    class="grid overflow-hidden transition-all duration-300 ease-in-out {expanded
      ? 'grid-rows-[1fr]'
      : 'grid-rows-[0fr]'}"
  >
    <div class="min-h-0">
      {#if rule.rule_type === 'badword_detection'}
        <div class="mt-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-800 p-2">
          <div
            class="flex max-w-40 items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
          >
            <input
              type="text"
              placeholder="Add Word..."
              class="h-full w-full"
              onkeydown={(e) => {
                if (e.key === 'Enter' && newWordInput) {
                  rule.words?.push(newWordInput);
                  newWordInput = '';
                }
              }}
              bind:value={newWordInput}
            />
            <button
              class="cursor-pointer rounded-lg p-1 transition-colors hover:bg-zinc-600"
              onclick={() => {
                if (newWordInput) {
                  rule.words?.push(newWordInput);
                  newWordInput = '';
                }
              }}
              aria-label="Add word"
            >
              <Plus size={16} />
            </button>
          </div>
          {#if rule.words}
            {#each rule.words as word, index (index)}
              <WordTile deleteThis={() => rule.words?.splice(index, 1)} {word} />
            {/each}
          {/if}
        </div>

        <div class="mt-2 flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-2">
            <Toggle bind:toggled={rule.match_whole_word} />
            <p class="text-sm text-zinc-300/60">Match Whole Word</p>
          </div>

          <div class="flex items-center gap-2">
            <Toggle bind:toggled={rule.case_sensitive} />
            <p class="text-sm text-zinc-300/60">Case Sensitive</p>
          </div>
        </div>
      {/if}
      <div class="mt-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-800 p-2">
        {#each rule.actions as _, index (index)}
          <ActionTile {roles} deleteThis={() => rule.actions.splice(index, 1)} bind:action={rule.actions[index]} />
        {/each}
        <button
          class="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base transition-colors hover:bg-zinc-600"
          onclick={() => (createNewOpen = true)}
        >
          <Plus size={16} />
          <p>Add Action...</p>
        </button>
      </div>
    </div>
  </div>
</div>
