<script lang="ts">
	import emojis from 'emojibase-data/en/data.json';
	import groupsSubgroups from 'emojibase-data/en/messages.json';
	import shortcodes from 'emojibase-data/en/shortcodes/joypixels.json';

	import type { Emoji } from 'emojibase';

	import Fuse from 'fuse.js';

	let searchInput = $state('');
	let selectedEmoji: Emoji | undefined = $state();

	for (const emoji of emojis) {
		const sc = shortcodes[emoji.hexcode];
		emoji.shortcodes = Array.isArray(sc) ? sc : sc ? [sc] : undefined;
	}

	const fuse = new Fuse(emojis, {
		keys: ['label', 'shortcodes'],
		threshold: 0.3
	});

	function getFilteredEmojis(search: string | undefined = '') {
		if (!search || search.trim() === '') return emojis;
		return fuse.search(search).map((result) => result.item);
	}

	let filteredEmojis: Emoji[] = $state(getFilteredEmojis());
</script>

<div
	class="flex h-full max-h-[30rem] min-h-[30rem] w-full max-w-96 flex-col rounded-xl border-2 border-zinc-600 bg-zinc-700"
>
	<div class="h-fit w-full flex-shrink-0 border-b-2 border-zinc-600 p-2">
		<input
			type="text"
			placeholder="Search emojis..."
			class="w-full rounded-md border-2 border-zinc-600 bg-zinc-800 p-2 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none"
			bind:value={searchInput}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					filteredEmojis = getFilteredEmojis(searchInput);
				}
			}}
		/>
	</div>

	<div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
		{#each groupsSubgroups.groups as group}
			{@const groupEmojis = filteredEmojis.filter((emoji) => emoji.group === group.order)}
			{#if groupEmojis.length > 0 && group.message !== 'Component'}
				<h3 class="text-md font-semibold capitalize">{group.message}</h3>
				<div class="grid grid-cols-7 gap-2">
					{#each groupEmojis as emoji}
						<img
							src="/emojis/{emoji.hexcode.toLowerCase()}.svg"
							alt={emoji.label}
							class="h-8 w-8"
							loading="lazy"
							decoding="async"
							onmouseover={() => (selectedEmoji = emoji)}
							onfocus={() => (selectedEmoji = emoji)}
						/>
					{/each}
				</div>
			{/if}
		{/each}
	</div>

	<div
		class="flex h-16 flex-shrink-0 items-center gap-2 overflow-hidden border-t-2 border-zinc-500 p-2"
	>
		{#if selectedEmoji}
			<img
				src="/emojis/{selectedEmoji.hexcode.toLowerCase()}.svg"
				alt={selectedEmoji.label}
				class="h-8 w-8"
				loading="lazy"
				decoding="async"
			/>
			<div class="max-w-full overflow-hidden">
				<p class="font-medium">{selectedEmoji.label}</p>
				<p class="truncate text-sm text-zinc-400 w-full">
					:{selectedEmoji.shortcodes?.join(': :')}:
				</p>
			</div>
		{:else}
			<p class="text-zinc-400">Hover over an emoji to see details</p>
		{/if}
	</div>
</div>
