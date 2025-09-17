<script lang="ts">
	import { Row, ToggleRow } from '$lib/components/ui/row';
	import WordTile from '$lib/components/ui/WordTile.svelte';
	import Saver from '$lib/components/Saver.svelte';
	import { Plus } from '@lucide/svelte';

	const { data } = $props();
	let dataState = $state(data);

	let newPrefixInput = $state('');

	$effect(() => {
		if (newPrefixInput.length > 5) newPrefixInput = newPrefixInput.slice(0, 5);
	});
</script>

<Saver bind:dataState />

<div>
	<h2 class="text-4xl font-bold">General Settings</h2>
	<p>Change general settings like prefixes and reply types.</p>
</div>

<Row>
	<h2 class="text-xl font-bold">Prefixes</h2>
	<p>
		Create and delete up to 5 prefixes that Titanium responds to. You can also mention Titanium or
		use slash commands.
	</p>
	<div class="mt-2 flex flex-wrap gap-2">
		{#if dataState.serverSettings.prefixes.length < 5}
			<div
				class="flex max-w-35 items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
			>
				<input
					type="text"
					placeholder="Add prefix..."
					class="h-full w-full"
					onkeydown={(e) => {
						if (e.key === 'Enter' && newPrefixInput) {
							dataState.serverSettings.prefixes.push(newPrefixInput);
							newPrefixInput = '';
						}
					}}
					bind:value={newPrefixInput}
				/>
				<button
					class="cursor-pointer rounded-lg p-1 transition-colors hover:bg-zinc-600"
					onclick={() => {
						if (newPrefixInput) {
							dataState.serverSettings.prefixes.push(newPrefixInput);
							newPrefixInput = '';
						}
					}}
				>
					<Plus size={16} />
				</button>
			</div>
		{/if}
		{#each dataState.serverSettings.prefixes as prefix, index}
			<WordTile
				word={prefix}
				deleteThis={() => dataState.serverSettings.prefixes.splice(index, 1)}
			/>
		{/each}
	</div>
</Row>

<ToggleRow bind:toggled={dataState.serverSettings.settings.loading_reaction}>
	<div>
		<h2 class="text-xl font-bold">Show Loading Reaction</h2>
		<p>
			Enable or disable the loading reaction that appears when Titanium is processing a prefix
			command. The loading indicator will always show for slash commands.
		</p>
	</div>
</ToggleRow>

<ToggleRow bind:toggled={dataState.serverSettings.settings.reply_ping}>
	<div>
		<h2 class="text-xl font-bold">Use Reply Pings</h2>
		<p>Control whether Titanium should use reply pings when responding to prefix commands.</p>
	</div>
</ToggleRow>
