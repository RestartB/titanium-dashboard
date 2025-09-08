<script lang="ts">
	import { Cog } from '@lucide/svelte';
	import type { Component } from 'svelte';
</script>

<div>
	<h1 class="text-4xl">
		Hi there, <span
			class="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text font-bold text-transparent"
			>Restart</span
		>
	</h1>
	<p>Manage settings for Titanium in <strong>SERVER NAME</strong> here.</p>
</div>

{#snippet featureCard(title: string, description: string, href: string, Icon: Component)}
	<a class="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4" {href}>
		<div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-700">
			<Icon size={32} />
		</div>
		<h2 class="font-xl font-bold">{title}</h2>
		<p>{description}</p>
	</a>
{/snippet}

<div class="grid grid-cols-3 gap-2">
	{@render featureCard(
		'General Settings',
		'Change general settings like prefixes and reply types.',
		'/general',
		Cog
	)}
	{@render featureCard(
		'Permissions',
		'Change permissions for different features in your server.',
		'/123/permissions',
		Cog
	)}
	{@render featureCard(
		'Error Log',
		'View and manage error logs for your server.',
		'/123/error-log',
		Cog
	)}
</div>

<p class="text-base font-bold text-zinc-300/60">FEATURES</p>

<div class="grid grid-cols-3 gap-2">
	{@render featureCard(
		'Moderation',
		'Moderate your server members and manage cases.',
		'/123/moderation',
		Cog
	)}
	{@render featureCard(
		'Automod',
		'Allow Titanium to moderate your server for you.',
		'/123/automod',
		Cog
	)}
	{@render featureCard(
		'Bouncer',
		'Allow Titanium to monitor users as they join.',
		'/123/bouncer',
		Cog
	)}
	{@render featureCard(
		'Logging',
		'Log various events that happen in your server.',
		'/123/logging',
		Cog
	)}
	{@render featureCard(
		'Fireboard',
		'Let server members highlight messages they love.',
		'/123/fireboard',
		Cog
	)}
	{@render featureCard(
		'Leaderboard',
		'Track engagement and activity in your server.',
		'/123/leaderboard',
		Cog
	)}
	{@render featureCard(
		'Server Counters',
		'Display various server statistics and counters.',
		'/123/server-counters',
		Cog
	)}
	{@render featureCard(
		'Self Roles',
		'Allow users to assign roles with buttons or reactions.',
		'/123/self-roles',
		Cog
	)}
</div>
