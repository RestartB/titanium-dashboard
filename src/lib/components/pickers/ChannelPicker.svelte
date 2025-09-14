<script lang="ts">
	import Channel from '$lib/components/ui/discord/Channel.svelte';
	import { X } from '@lucide/svelte';

	import Fuse from 'fuse.js';
	import type { ChannelInfo, CategoryInfo } from '$lib/types/server_info';

	let {
		channels,
		categories,
		overlayOpen = $bindable(true)
	}: { channels: ChannelInfo[]; categories: CategoryInfo[]; overlayOpen?: boolean } = $props();

	let searchInput = $state('');

	const fuse = new Fuse(channels, {
		keys: ['name'],
		threshold: 0.3
	});

	function getFilteredChannels(query: string): ChannelInfo[] {
		if (!query) return channels;

		const lowercasedQuery = query.toLowerCase();
		return fuse.search(lowercasedQuery).map((result) => result.item);
	}

	let filteredChannels = $derived(getFilteredChannels(searchInput));
	let noCategoryChannels = $derived(
		filteredChannels.filter((channel) => channel.category === null)
	);
</script>

<div
	class="flex w-full max-w-104 flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
>
	<div class="items-between flex w-full justify-center gap-2">
		<h2 class="text-xl font-bold">Select a Channel</h2>
		<button
			class="ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
			onclick={() => (overlayOpen = false)}
			aria-label="Close channel selector"
		>
			<X class="h-6 w-6" />
		</button>
	</div>
	<div
		class="flex h-full max-h-[30rem] min-h-[30rem] w-full max-w-96 flex-shrink-0 flex-col rounded-xl border-2 border-zinc-600 bg-zinc-700"
	>
		<div class="flex h-fit w-full flex-shrink-0 flex-col gap-2 border-b-2 border-zinc-600 p-2">
			<input
				type="text"
				placeholder="Search channels..."
				class="w-full rounded-md border-2 border-zinc-600 bg-zinc-800 p-2 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
				bind:value={searchInput}
			/>
		</div>

		<div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-2">
			{#if noCategoryChannels.length > 0}
				<div class="flex flex-col gap-1">
					{#each noCategoryChannels as channel}
						<Channel channel={channel.name} type={channel.type} />
					{/each}
				</div>
			{/if}
			{#each categories as category}
				{@const categoryChannels = filteredChannels.filter(
					(channel) => channel.category === category.id
				)}
				{#if categoryChannels.length > 0}
					<div class="flex flex-col gap-1">
						<h3 class="text-base font-semibold text-zinc-400">
							{category.name}
						</h3>
						{#each categoryChannels as channel}
							<Channel channel={channel.name} type={channel.type} />
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
