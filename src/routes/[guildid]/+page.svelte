<script lang="ts">
	import {
		Cog,
		Key,
		TriangleAlert,
		Shield,
		Brain,
		DoorClosedLocked,
		ScrollText,
		Flame,
		Trophy,
		Tally5,
		Users
	} from '@lucide/svelte';
	import type { Component } from 'svelte';

	const { data } = $props();
	const serverID = data.serverInfo.id;
</script>

<div>
	<h1 class="text-4xl">
		Hi there, <span
			class="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text font-bold text-transparent"
			translate="no">Restart</span
		>
	</h1>
	<p>
		Manage settings for Titanium in <strong translate="no">{data.serverInfo.name}</strong> here.
	</p>
</div>

{#snippet featureCard(title: string, description: string, href: string, Icon: Component)}
	<a
		class="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4 shadow-lg transition-colors hover:bg-zinc-700"
		{href}
	>
		<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-600">
			<Icon size={28} />
		</div>
		<h2 class="font-xl font-bold">{title}</h2>
		<p>{description}</p>
	</a>
{/snippet}

<div class="grid grid-cols-3 gap-4">
	{@render featureCard(
		'General Settings',
		'Change general settings like prefixes and reply types.',
		`/${serverID}/general`,
		Cog
	)}
	{@render featureCard(
		'Permissions',
		'Change permissions for different features in your server.',
		`/${serverID}/permissions`,
		Key
	)}
	{@render featureCard(
		'Error Log',
		'View and manage error logs for your server.',
		`/${serverID}/error-log`,
		TriangleAlert
	)}
</div>

<p class="text-base font-bold text-zinc-300/60">FEATURES</p>

<div class="grid grid-cols-3 gap-4">
	{@render featureCard(
		'Moderation',
		'Moderate your server members and manage cases.',
		`/${serverID}/moderation`,
		Shield
	)}
	{@render featureCard(
		'Automod',
		'Allow Titanium to moderate your server for you.',
		`/${serverID}/automod`,
		Brain
	)}
	{@render featureCard(
		'Bouncer',
		'Allow Titanium to monitor users as they join.',
		`/${serverID}/bouncer`,
		DoorClosedLocked
	)}
	{@render featureCard(
		'Logging',
		'Log various events that happen in your server.',
		`/${serverID}/logging`,
		ScrollText
	)}
	{@render featureCard(
		'Fireboard',
		'Let server members highlight messages they love.',
		`/${serverID}/fireboard`,
		Flame
	)}
	{@render featureCard(
		'Leaderboard',
		'Track engagement and activity in your server.',
		`/${serverID}/leaderboard`,
		Trophy
	)}
	{@render featureCard(
		'Server Counters',
		'Display various server statistics and counters.',
		`/${serverID}/server_counters`,
		Tally5
	)}
	{@render featureCard(
		'Self Roles',
		'Allow users to assign roles with buttons or reactions.',
		`/${serverID}/self-roles`,
		Users
	)}
</div>
