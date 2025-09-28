<script lang="ts">
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import ToggledContent from '$lib/components/ui/ToggledContent.svelte';
	import Board from '$lib/components/fireboard/Board.svelte';
	import Saver from '$lib/components/Saver.svelte';

	import type { FireboardBoard } from '$lib/types/fireboard';

	let { data } = $props();
	let dataState = $state(data);

	function createBlankBoard(): FireboardBoard {
		return {
			channel_id: '',
			reaction: '🔥',
			threshold: 5,
			ignore_bots: true,
			ignore_self_reactions: true,
			ignored_channels: [],
			ignored_roles: []
		};
	}
</script>

<Saver page="fireboard" bind:dataState />

<div class="flex items-center justify-between gap-4">
	<div class="flex-1">
		<h2 class="text-4xl font-bold">Fireboard</h2>
		<p>Let server members highlight messages they love.</p>
	</div>
	<Toggle bind:toggled={dataState.serverSettings.modules.fireboard} />
</div>

<ToggledContent enabled={dataState.serverSettings.modules.fireboard}>
	<div class="flex flex-col gap-4">
		<button
			class="w-fit cursor-pointer rounded-lg border-2 border-zinc-700 bg-zinc-800 p-2 px-4 transition-colors hover:bg-zinc-600"
			onclick={() => {
				dataState.pageSettings.boards.push(createBlankBoard());
			}}>Add Board</button
		>
		{#each dataState.pageSettings.boards as _, index}
			<Board
				bind:board={dataState.pageSettings.boards[index]}
				serverInfo={data.serverInfo}
				deleteThis={() => {
					dataState.pageSettings.boards.splice(index, 1);
				}}
			/>
		{/each}
	</div>
</ToggledContent>
