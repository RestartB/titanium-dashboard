<script lang="ts">
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
	import Channel from '$lib/components/server_counters/Channel.svelte';
	import Saver from '$lib/components/Saver.svelte';

	import type { ServerCounterChannel } from '$lib/types/server_counters';

	let { data } = $props();
	let dataState = $state(data);

	function createBlankChannel(): ServerCounterChannel {
		return {
			name: '',
			type: ''
		};
	}
</script>

<Saver page="server_counters" bind:dataState />

<div class="flex items-center justify-between gap-4">
	<div class="flex-1">
		<h2 class="text-4xl font-bold">Server Counters</h2>
		<p>Display various server statistics and counters in your channel list.</p>
	</div>
	<Toggle bind:toggled={dataState.serverSettings.modules.server_counters} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.server_counters}>
	<div class="flex flex-col gap-4">
		<button
			class="w-fit cursor-pointer rounded-lg border-2 border-zinc-700 bg-zinc-800 p-2 px-4 transition-colors hover:bg-zinc-600"
			onclick={() => {
				dataState.pageSettings.channels.push(createBlankChannel());
			}}>Add Channel</button
		>
		{#each dataState.pageSettings.channels as _, index}
			<Channel
				{index}
				bind:channel={dataState.pageSettings.channels[index]}
				deleteThis={() => {
					dataState.pageSettings.channels.splice(index, 1);
				}}
			/>
		{/each}
	</div>
</ToggledContent>
