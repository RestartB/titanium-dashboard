<script lang="ts">
	import Row from '$lib/components/ui/row/Row.svelte';
	import Rule from '$lib/components/automod/Rule.svelte';
	import Collapsible from '$lib/components/ui/Collapsible.svelte';
	import Saver from '$lib/components/Saver.svelte';
	import type { AutomodRule } from '$lib/types/automod';

	const { data } = $props();
	let dataState = $state(data);

	function createBlankRule(): AutomodRule {
		return {
			id: '',
			rule_type: '',
			rule_name: '',
			words: [],
			antispam_type: '',
			occurences: 0,
			threshold: 0,
			duration: 0,
			actions: []
		};
	}
</script>

<Saver page="automod" bind:dataState />

<div>
	<h2 class="text-4xl font-bold">Automod</h2>
	<p>Set up automated moderation actions for your server.</p>
</div>

<Collapsible title="Word Filters" defaultState={true}>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Row>
			<div class="flex flex-col gap-2">
				<h3 class="text-xl font-bold">Word Detection</h3>
				<p>Detect messages that contain certain words.</p>
				<button
					class="cursor-pointer rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
					onclick={() => {
						const rule = createBlankRule();
						rule.rule_type = 'badword_detection';
						dataState.automod_settings.badword_detection.rules.push(rule);
					}}>Add Rule</button
				>

				{#each dataState.automod_settings.badword_detection.rules as rule, index}
					<Rule
						bind:rule={dataState.automod_settings.badword_detection.rules[index]}
						deleteThis={() => dataState.automod_settings.badword_detection.rules.splice(index, 1)}
					/>
				{/each}
			</div>
		</Row>
	</div>
</Collapsible>
<Collapsible title="Link Filters" defaultState={true}>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Row>
			<div class="flex flex-col gap-2">
				<h3 class="text-xl font-bold">Malicious Links</h3>
				<p>Detect messages that contain malicious links.</p>
				<button
					class="cursor-pointer rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
					onclick={() => {
						const rule = createBlankRule();
						rule.rule_type = 'malicious_link';
						dataState.automod_settings.malicious_link_detection.rules.push(rule);
					}}>Add Rule</button
				>

				{#each dataState.automod_settings.malicious_link_detection.rules as rule, index}
					<Rule
						bind:rule={dataState.automod_settings.malicious_link_detection.rules[index]}
						deleteThis={() =>
							dataState.automod_settings.malicious_link_detection.rules.splice(index, 1)}
					/>
				{/each}
			</div>
		</Row>
		<Row>
			<div class="flex flex-col gap-2">
				<h3 class="text-xl font-bold">Phishing Links</h3>
				<p>Detect messages that contain phishing links.</p>
				<button
					class="cursor-pointer rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
					onclick={() => {
						const rule = createBlankRule();
						rule.rule_type = 'phishing_link';
						dataState.automod_settings.phishing_link_detection.rules.push(rule);
					}}>Add Rule</button
				>

				{#each dataState.automod_settings.phishing_link_detection.rules as rule, index}
					<Rule
						bind:rule={dataState.automod_settings.phishing_link_detection.rules[index]}
						deleteThis={() =>
							dataState.automod_settings.phishing_link_detection.rules.splice(index, 1)}
					/>
				{/each}
			</div>
		</Row>
	</div>
</Collapsible>
<Collapsible title="Spam Filters" defaultState={true}>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Row>
			<div class="flex flex-col gap-2">
				<h3 class="text-xl font-bold">Message Spam</h3>
				<p>Detect when users are sending messages too fast.</p>
				<button
					class="cursor-pointer rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
					onclick={() => {
						const rule = createBlankRule();
						rule.rule_type = 'spam_detection';
						rule.antispam_type = 'message_spam';
						dataState.automod_settings.spam_detection.rules.push(rule);
					}}>Add Rule</button
				>

				{#each dataState.automod_settings.spam_detection.rules as rule, index}
					{#if rule.antispam_type === 'message_spam'}
						<Rule
							bind:rule={dataState.automod_settings.spam_detection.rules[index]}
							deleteThis={() => dataState.automod_settings.spam_detection.rules.splice(index, 1)}
						/>
					{/if}
				{/each}
			</div>
		</Row>
		<Row>
			<div class="flex flex-col gap-2">
				<h3 class="text-xl font-bold">Mention Spam</h3>
				<p>Detect when users are mentioning too many users.</p>
				<button
					class="cursor-pointer rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
					onclick={() => {
						const rule = createBlankRule();
						rule.rule_type = 'spam_detection';
						rule.antispam_type = 'mention_spam';
						dataState.automod_settings.spam_detection.rules.push(rule);
					}}>Add Rule</button
				>

				{#each dataState.automod_settings.spam_detection.rules as rule, index}
					{#if rule.antispam_type === 'mention_spam'}
						<Rule
							bind:rule={dataState.automod_settings.spam_detection.rules[index]}
							deleteThis={() => dataState.automod_settings.spam_detection.rules.splice(index, 1)}
						/>
					{/if}
				{/each}
			</div>
		</Row>
		<Row>
			<div class="flex flex-col gap-2">
				<h3 class="text-xl font-bold">Word Spam</h3>
				<p>Detect when users are sending too many words.</p>
				<button
					class="cursor-pointer rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
					onclick={() => {
						const rule = createBlankRule();
						rule.rule_type = 'spam_detection';
						rule.antispam_type = 'word_spam';
						dataState.automod_settings.spam_detection.rules.push(rule);
					}}>Add Rule</button
				>

				{#each dataState.automod_settings.spam_detection.rules as rule, index}
					{#if rule.antispam_type === 'word_spam'}
						<Rule
							bind:rule={dataState.automod_settings.spam_detection.rules[index]}
							deleteThis={() => dataState.automod_settings.spam_detection.rules.splice(index, 1)}
						/>
					{/if}
				{/each}
			</div>
		</Row>
		<Row>
			<div class="flex flex-col gap-2">
				<h3 class="text-xl font-bold">Newline Spam</h3>
				<p>Detect when users are sending too many newlines.</p>
				<button
					class="cursor-pointer rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
					onclick={() => {
						const rule = createBlankRule();
						rule.rule_type = 'spam_detection';
						rule.antispam_type = 'newline_spam';
						dataState.automod_settings.spam_detection.rules.push(rule);
					}}>Add Rule</button
				>

				{#each dataState.automod_settings.spam_detection.rules as rule, index}
					{#if rule.antispam_type === 'newline_spam'}
						<Rule
							bind:rule={dataState.automod_settings.spam_detection.rules[index]}
							deleteThis={() => dataState.automod_settings.spam_detection.rules.splice(index, 1)}
						/>
					{/if}
				{/each}
			</div>
		</Row>
		<Row>
			<div class="flex flex-col gap-2">
				<h3 class="text-xl font-bold">Link Spam</h3>
				<p>Detect when users are sending too many links.</p>
				<button
					class="cursor-pointer rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
					onclick={() => {
						const rule = createBlankRule();
						rule.rule_type = 'spam_detection';
						rule.antispam_type = 'link_spam';
						dataState.automod_settings.spam_detection.rules.push(rule);
					}}>Add Rule</button
				>

				{#each dataState.automod_settings.spam_detection.rules as rule, index}
					{#if rule.antispam_type === 'link_spam'}
						<Rule
							bind:rule={dataState.automod_settings.spam_detection.rules[index]}
							deleteThis={() => dataState.automod_settings.spam_detection.rules.splice(index, 1)}
						/>
					{/if}
				{/each}
			</div>
		</Row>
		<Row>
			<div class="flex flex-col gap-2">
				<h3 class="text-xl font-bold">Attachment Spam</h3>
				<p>Detect when users are sending too many attachments.</p>
				<button
					class="cursor-pointer rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
					onclick={() => {
						const rule = createBlankRule();
						rule.rule_type = 'spam_detection';
						rule.antispam_type = 'attachment_spam';
						dataState.automod_settings.spam_detection.rules.push(rule);
					}}>Add Rule</button
				>

				{#each dataState.automod_settings.spam_detection.rules as rule, index}
					{#if rule.antispam_type === 'attachment_spam'}
						<Rule
							bind:rule={dataState.automod_settings.spam_detection.rules[index]}
							deleteThis={() => dataState.automod_settings.spam_detection.rules.splice(index, 1)}
						/>
					{/if}
				{/each}
			</div>
		</Row>
		<Row>
			<div class="flex flex-col gap-2">
				<h3 class="text-xl font-bold">Emoji Spam</h3>
				<p>Detect when users are sending too many emojis.</p>
				<button
					class="cursor-pointer rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
					onclick={() => {
						const rule = createBlankRule();
						rule.rule_type = 'spam_detection';
						rule.antispam_type = 'emoji_spam';
						dataState.automod_settings.spam_detection.rules.push(rule);
					}}>Add Rule</button
				>

				{#each dataState.automod_settings.spam_detection.rules as rule, index}
					{#if rule.antispam_type === 'emoji_spam'}
						<Rule
							bind:rule={dataState.automod_settings.spam_detection.rules[index]}
							deleteThis={() => dataState.automod_settings.spam_detection.rules.splice(index, 1)}
						/>
					{/if}
				{/each}
			</div>
		</Row>
	</div>
</Collapsible>
