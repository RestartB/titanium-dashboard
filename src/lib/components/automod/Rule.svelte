<script lang="ts">
	import { fade } from 'svelte/transition';
	import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
	import ActionPicker from '$lib/components/automod/ActionPicker.svelte';
	import ActionTile from './ActionTile.svelte';

	import { ChevronDown } from '@lucide/svelte';
	import type { AutomodRule } from '$lib/types/automod';

	let { rule = $bindable() }: { rule: AutomodRule } = $props();
	let expanded = $state(false);
	let createNewOpen = $state(false);

	const occurenceStrings = {
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

	let occurenceString = $state('');
	if (rule.rule_type === 'spam_detection') {
		occurenceString =
			occurenceStrings[rule.antispam_type as keyof typeof occurenceStrings] || 'messages';
	} else {
		occurenceString =
			occurenceStrings[rule.rule_type as keyof typeof occurenceStrings] || 'messages';
	}

	$effect(() => {
		rule.occurences = Number(rule.occurences);
		if (isNaN(rule.occurences) || rule.occurences < 1) rule.occurences = 1;

		rule.duration = Number(rule.duration);
		if (isNaN(rule.duration) || rule.duration < 1) rule.duration = 1;
	});
</script>

{#if createNewOpen}
	<FullscreenOverlay bind:overlayOpen={createNewOpen}>
		<ActionPicker bind:rule bind:overlayOpen={createNewOpen} />
	</FullscreenOverlay>
{/if}

<div
	class="w-full rounded-lg border-2 border-zinc-800 bg-zinc-700 p-2"
	transition:fade={{ duration: 100 }}
>
	<div class="flex w-full items-center justify-between gap-2">
		<div class="flex flex-wrap items-center gap-2">
			<input
				type="text"
				class="w-12 flex-shrink-0 rounded-lg border-2 border-zinc-700 bg-zinc-800 p-1 px-2 text-center font-mono"
				bind:value={rule.occurences}
			/>
			<p>{occurenceString} in</p>
			<input
				type="text"
				class="w-12 flex-shrink-0 rounded-lg border-2 border-zinc-700 bg-zinc-800 p-1 px-2 text-center font-mono"
				bind:value={rule.duration}
			/>
			<p>seconds</p>
		</div>
		<button
			class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-600"
			aria-label="Expand rule details"
			onclick={() => (expanded = !expanded)}
		>
			<ChevronDown
				size={18}
				class={`transition-transform duration-200 ${expanded ? 'rotate-180' : 'rotate-0'}`}
			/>
		</button>
	</div>
	<div
		class="grid overflow-hidden transition-all duration-300 ease-in-out {expanded
			? 'grid-rows-[1fr]'
			: 'grid-rows-[0fr]'}"
	>
		<div class="min-h-0">
			<div class="mt-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-800 p-2">
				{#each rule.actions as action, index}
					<ActionTile
						deleteThisAction={() => rule.actions.splice(index, 1)}
						bind:action={rule.actions[index]}
					/>
				{/each}
				<button
					class="rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
					onclick={() => (createNewOpen = true)}>Add Action...</button
				>
			</div>
		</div>
	</div>
</div>
