<script lang="ts">
	import Row from '$lib/components/ui/row/Row.svelte';
	import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
	import TypePicker from './TypePicker.svelte';
	import { Trash, Cog } from '@lucide/svelte';

	import { typeDisplayNames } from '$lib/strings/server_counters';
	import type { ServerCounterChannel } from '$lib/types/server_counters';

	let {
		index,
		channel = $bindable(),
		deleteThis
	}: {
		index: number;
		channel: ServerCounterChannel;
		deleteThis: () => void;
	} = $props();

	let typePickerOpen = $state(false);
</script>

{#if typePickerOpen}
	<FullscreenOverlay bind:overlayOpen={typePickerOpen}>
		<TypePicker bind:channel bind:overlayOpen={typePickerOpen} />
	</FullscreenOverlay>
{/if}

<Row class="flex flex-col gap-2">
	<div class="flex items-center gap-2">
		<button
			class="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg bg-zinc-700 transition-colors hover:bg-zinc-600"
			aria-label="Delete channel"
			onclick={() => {
				deleteThis?.();
			}}
		>
			<Trash class="h-4 w-4" />
		</button>
		<button
			class="flex h-10 w-fit flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-700 px-2 transition-colors hover:bg-zinc-600"
			aria-label="Open type picker"
			onclick={() => {
				typePickerOpen = true;
			}}
		>
			<Cog class="h-4 w-4" />
			{typeDisplayNames[channel.type] || 'Select Type'}
		</button>
	</div>

	<div>
		<label for="channel-name-{index}" class="font-bold">Channel Name</label>
		<p>The name of the channel. You can use &#123;value&#125; to insert the counter value.</p>
	</div>
	<input
		id="channel-name-{index}"
		type="text"
		bind:value={channel.name}
		placeholder="e.g. Members: &#123;value&#125;"
		class="w-full rounded-lg border-2 border-zinc-700 bg-zinc-800 p-2 transition-colors outline-none focus:border-zinc-500"
	/>
	<p class="text-base text-zinc-400">Preview: {channel.name.replace('{value}', '1234')}</p>
</Row>
