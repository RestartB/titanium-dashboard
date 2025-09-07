<script lang="ts">
	import type { Component } from 'svelte';
	import { Smile, UserRound, Cat, Pizza, Earth, Gamepad2, Lamp, Heart, Flag } from '@lucide/svelte';

	import emojis from 'emojibase-data/en/data.json';
	import groupsSubgroups from 'emojibase-data/en/messages.json';
	import shortcodes from 'emojibase-data/en/shortcodes/joypixels.json';

	import type { Emoji } from 'emojibase';

	import Fuse from 'fuse.js';

	let searchInput = $state('');
	let selectedEmoji: Emoji | undefined = $state();
	let emojiScrollDiv: HTMLDivElement | undefined = $state();
	let activeSection = $state('');

	for (const emoji of emojis) {
		const sc = shortcodes[emoji.hexcode];
		emoji.shortcodes = Array.isArray(sc) ? sc : sc ? [sc] : undefined;
	}

	const fuse = new Fuse(emojis, {
		keys: ['label', 'shortcodes'],
		threshold: 0.3
	});

	function getEmojiFilename(hexcode: string): string {
		const cleanHexcode = hexcode.toLowerCase().replace(/^00/, '');

		// Override for 3 dashes in hexcode
		if (cleanHexcode.split('-').length === 3) {
			return `/emojis/${cleanHexcode.replace(/fe0f-/, '')}.svg`;
		}

		// Override for eye in speech bubble
		if (cleanHexcode === '1f441-fe0f-200d-1f5e8-fe0f') {
			return `/emojis//1f441-200d-1f5e8.svg`;
		}

		return `/emojis/${cleanHexcode}.svg`;
	}

	function getFilteredEmojis(search: string | undefined = '') {
		if (!search || search.trim() === '') return emojis;
		return fuse.search(search).map((result) => result.item);
	}

	const sectionIcons: Record<string, Component> = {
		'smileys & emotion': Smile,
		'people & body': UserRound,
		'animals & nature': Cat,
		'food & drink': Pizza,
		'travel & places': Earth,
		activities: Gamepad2,
		objects: Lamp,
		symbols: Heart,
		flags: Flag
	};

	function scrollToSection(section: string) {
		searchInput = '';
		filteredEmojis = getFilteredEmojis();

		// Wait for sections to render
		setTimeout(() => {
			const element = document.getElementById(section);
			if (element && emojiScrollDiv) {
				// Calculate scroll position
				const containerRect = emojiScrollDiv.getBoundingClientRect();
				const elementRect = element.getBoundingClientRect();
				const scrollTop = emojiScrollDiv.scrollTop + (elementRect.top - containerRect.top);

				emojiScrollDiv.scrollTo({
					top: scrollTop,
					behavior: 'smooth'
				});
			}
		}, 0);
	}

	function handleScroll() {
		if (!emojiScrollDiv) return;

		const containerRect = emojiScrollDiv.getBoundingClientRect();
		const scrollTop = emojiScrollDiv.scrollTop;

		for (const group of groupsSubgroups.groups) {
			if (group.message === 'components') continue;

			const element = document.getElementById(group.message);
			if (element) {
				const elementRect = element.getBoundingClientRect();
				const relativeTop = elementRect.top - containerRect.top + scrollTop;

				if (relativeTop <= scrollTop + 50) {
					activeSection = group.message;
				}
			}
		}
	}

	let filteredEmojis: Emoji[] = $state(getFilteredEmojis());
</script>

{#snippet emojiJumper(section: string, ButtonIcon: Component)}
	<button
		onclick={() => scrollToSection(section)}
		class="rounded-full p-1 transition-colors {activeSection === section
			? 'bg-zinc-500'
			: 'hover:bg-zinc-600/50'}"
	>
		<ButtonIcon size={24} />
	</button>
{/snippet}

<div
	class="flex h-full max-h-[30rem] min-h-[30rem] w-full max-w-96 flex-col rounded-xl border-2 border-zinc-600 bg-zinc-700"
>
	<div class="flex h-fit w-full flex-shrink-0 flex-col gap-2 border-b-2 border-zinc-600 p-2">
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

		<div class="flex items-center gap-2">
			{#each groupsSubgroups.groups as group}
				{#if group.message !== 'components'}
					{@render emojiJumper(group.message, sectionIcons[group.message] || Smile)}
				{/if}
			{/each}
		</div>
	</div>

	<div
		class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2"
		bind:this={emojiScrollDiv}
		onscroll={handleScroll}
	>
		{#each groupsSubgroups.groups as group}
			{@const groupEmojis = filteredEmojis.filter((emoji) => emoji.group === group.order)}
			{#if groupEmojis.length > 0 && group.message !== 'components'}
				{@const IconComponent = sectionIcons[group.message]}
				<div class="flex items-center justify-center gap-2" id={group.message}>
					{#if IconComponent}
						<IconComponent size={24} />
					{/if}
					<h3 class="text-md font-semibold capitalize">{group.message}</h3>
				</div>
				<div class="grid grid-cols-7 place-items-center gap-2">
					{#each groupEmojis as emoji}
						<img
							src={getEmojiFilename(emoji.hexcode)}
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
				src={getEmojiFilename(selectedEmoji.hexcode)}
				alt={selectedEmoji.label}
				class="h-8 w-8"
				loading="lazy"
				decoding="async"
			/>
			<div class="max-w-full overflow-hidden">
				<p class="font-medium">{selectedEmoji.label}</p>
				<p class="w-full truncate text-sm text-zinc-400">
					:{selectedEmoji.shortcodes?.join(': :')}:
				</p>
			</div>
		{:else}
			<p class="text-zinc-400">Hover over an emoji to see details</p>
		{/if}
	</div>
</div>
