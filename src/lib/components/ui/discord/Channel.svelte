<script lang="ts">
	import FullscreenOverlay from '../FullscreenOverlay.svelte';
	import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
	import { Hash, Megaphone, MessagesSquare, Volume2, Podcast } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import type { ChannelInfo, CategoryInfo } from '$lib/types/server_info';

	let overlayOpen = $state(false);

	const {
		channel,
		type = '',
		hasSelector = false,
		channels = [],
		categories = []
	}: {
		channel: string | null;
		type: string;
		hasSelector?: boolean;
		channels?: ChannelInfo[];
		categories?: CategoryInfo[];
	} = $props();
	const channelTypeIcons: Record<string, Component> = {
		text: Hash,
		news: Megaphone,
		forum: MessagesSquare,
		voice: Volume2,
		stage_voice: Podcast
	};
</script>

{#if overlayOpen}
	<FullscreenOverlay bind:overlayOpen>
		<ChannelPicker {channels} {categories} bind:overlayOpen />
	</FullscreenOverlay>
{/if}

{#snippet channelContent()}
	{#if channel}
		{#if channelTypeIcons[type]}
			{@const Icon = channelTypeIcons[type]}
			<Icon class="h-4 w-4 text-zinc-400" />
		{:else}
			<Hash class="h-4 w-4 text-zinc-400" />
		{/if}
		<p class="text-zinc-200 select-none">{channel}</p>
	{:else}
		<p class="text-zinc-500 select-none">No channel set</p>
	{/if}
{/snippet}

{#if hasSelector}
	<button
		class="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-zinc-800 p-1 px-2 transition-colors hover:bg-zinc-600"
		onclick={() => (overlayOpen = !overlayOpen)}
	>
		{@render channelContent()}
	</button>
{:else}
	<div class="flex w-fit items-center gap-2 rounded-lg bg-zinc-800 p-1 px-2">
		{@render channelContent()}
	</div>
{/if}
