<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import Rule from '$lib/components/automod/Rule.svelte';
  import Collapsible from '$lib/components/ui/Collapsible.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
  import Saver from '$lib/components/Saver.svelte';
  import type { AutomodRuleSchema } from '$lib/validators/automod';

  const { data } = $props();
  let dataState = $state(data);

  function createBlankRule(
    ruleType: AutomodRuleSchema['rule_type'],
    spamType?: AutomodRuleSchema['antispam_type']
  ): AutomodRuleSchema {
    return {
      id: crypto.randomUUID(),
      rule_type: ruleType,
      rule_name: '',
      words: [],
      match_whole_word: false,
      case_sensitive: false,
      antispam_type: spamType,
      threshold: 1,
      duration: 1,
      actions: []
    };
  }
</script>

{#snippet rulesCard(
  title: string,
  description: string,
  type: AutomodRuleSchema['rule_type'],
  rules: AutomodRuleSchema[],
  spamType?: AutomodRuleSchema['antispam_type']
)}
  <Row>
    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-bold">{title}</h3>
      <p>{description}</p>
      <button
        class="cursor-pointer rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
        onclick={() => {
          const rule = createBlankRule(type, spamType);
          rules.push(rule);
        }}>Add Rule</button
      >

      {#each rules as rule, index (rule.id)}
        {#if type === 'spam_detection' && spamType === rule.antispam_type}
          <Rule roles={dataState.serverInfo.roles} bind:rule={rules[index]} deleteThis={() => rules.splice(index, 1)} />
        {:else if type !== 'spam_detection'}
          <Rule roles={dataState.serverInfo.roles} bind:rule={rules[index]} deleteThis={() => rules.splice(index, 1)} />
        {/if}
      {/each}
    </div>
  </Row>
{/snippet}

<Saver page="automod" {data} bind:dataState />

<div class="flex items-center justify-between gap-4">
  <div class="flex-1">
    <h2 class="text-4xl font-bold">Automod</h2>
    <p>Set up automated moderation actions for your server.</p>
  </div>
  <Toggle bind:toggled={dataState.serverSettings.modules.automod} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.automod}>
  <Collapsible title="Word Filters" defaultState={true}>
    <div class="grid grid-cols-1 gap-4 sidebar:grid-cols-1 xs:grid-cols-2 lg:grid-cols-2">
      {@render rulesCard(
        'Word Detection',
        'Detect messages that contain certain words.',
        'badword_detection',
        dataState.pageSettings.badword_detection
      )}
    </div>
  </Collapsible>
  <Collapsible title="Link Filters" defaultState={true}>
    <div class="grid grid-cols-1 gap-4 sidebar:grid-cols-1 xs:grid-cols-2 lg:grid-cols-2">
      {@render rulesCard(
        'Malicious Links',
        'Detect messages that contain malicious links.',
        'malicious_link',
        dataState.pageSettings.malicious_link_detection
      )}
      {@render rulesCard(
        'Phishing Links',
        'Detect messages that contain phishing links.',
        'phishing_link',
        dataState.pageSettings.phishing_link_detection
      )}
    </div>
  </Collapsible>
  <Collapsible title="Spam Filters" defaultState={true}>
    <div class="grid grid-cols-1 gap-4 sidebar:grid-cols-1 xs:grid-cols-2 lg:grid-cols-2">
      {@render rulesCard(
        'Message Spam',
        'Detect when users are sending messages too fast.',
        'spam_detection',
        dataState.pageSettings.spam_detection,
        'message'
      )}
      {@render rulesCard(
        'Mention Spam',
        'Detect when users are mentioning too many users.',
        'spam_detection',
        dataState.pageSettings.spam_detection,
        'mention'
      )}
      {@render rulesCard(
        'Word Spam',
        'Detect when users are sending too many words.',
        'spam_detection',
        dataState.pageSettings.spam_detection,
        'word'
      )}
      {@render rulesCard(
        'Newline Spam',
        'Detect when users are sending too many newlines.',
        'spam_detection',
        dataState.pageSettings.spam_detection,
        'newline'
      )}
      {@render rulesCard(
        'Link Spam',
        'Detect when users are sending too many links.',
        'spam_detection',
        dataState.pageSettings.spam_detection,
        'link'
      )}
      {@render rulesCard(
        'Attachment Spam',
        'Detect when users are sending too many attachments.',
        'spam_detection',
        dataState.pageSettings.spam_detection,
        'attachment'
      )}
      {@render rulesCard(
        'Emoji Spam',
        'Detect when users are sending too many emojis.',
        'spam_detection',
        dataState.pageSettings.spam_detection,
        'emoji'
      )}
    </div>
  </Collapsible>
</ToggledContent>
