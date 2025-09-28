<script lang="ts">
	import { page } from '$app/state';
	import { fade, fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { sidebarState } from '$lib/states/sidebar.svelte';

	import Avatar from '$lib/components/ui/Avatar.svelte';
	import { PanelLeft, X, Menu, Server, LifeBuoy } from '@lucide/svelte';
	import logo from '$lib/assets/logo.svg';

	let { userData }: { userData?: any | null | undefined } = $props();

	let menuOpen = $state(false);
	let pageWithSidebar = page.url.pathname !== '/' && !page.url.pathname.startsWith('/auth');
</script>

<header
	class="fixed z-100 h-12 w-full border-b-4 border-b-zinc-700 bg-zinc-800 text-base"
	style="view-transition-name: header"
>
	<div class="mx-auto flex h-full max-w-7xl items-center">
		<div class="flex h-full items-center">
			{#if pageWithSidebar}
				<button
					class="cursor-pointer p-4 sidebar:hidden"
					onclick={() => (sidebarState.open = !sidebarState.open)}
					aria-label="{sidebarState.open ? 'Close' : 'Open'} sidebar"
				>
					{#if sidebarState.open}
						<X class="h-6 w-6" />
					{:else}
						<PanelLeft class="h-6 w-6" />
					{/if}
				</button>
			{/if}

			<div class="mr-2 flex items-center gap-2 {pageWithSidebar ? 'sidebar:pl-4' : 'pl-4'}">
				<img src={logo} alt="Titanium" class="h-8 w-8 rounded-md" translate="no" />
				<h1 class="text-lg font-bold" translate="no">Titanium</h1>
			</div>

			{#if userData}
				<a href="/" class="hidden h-full items-center px-2 xxs:flex">Servers</a>
			{/if}
			<a
				href="https://titaniumbot.me/server"
				target="_blank"
				class="hidden h-full items-center px-2 xxs:flex">Support</a
			>
		</div>

		<div class="ml-auto flex items-center gap-2 xxs:pr-4">
			{#if userData}
				<Avatar
					src={userData.avatar
						? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
						: undefined}
					name={userData?.global_name || userData?.username}
					size={24}
					circle={true}
				/>
				<p class="truncate font-bold" translate="no">
					{userData?.global_name || userData?.username}
				</p>
			{:else}
				<p class="font-bold opacity-70">Not logged in</p>
			{/if}
		</div>

		<button
			class="cursor-pointer p-4 xxs:hidden"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label="{menuOpen ? 'Close' : 'Open'} menu"
		>
			{#if menuOpen}
				<X class="h-6 w-6" />
			{:else}
				<Menu class="h-6 w-6" />
			{/if}
		</button>

		{#if menuOpen}
			<div
				class="fixed inset-0 isolate mt-12 flex items-start justify-end overflow-hidden bg-white/60 p-4 backdrop-blur-lg dark:bg-black/60"
				transition:fade={{ duration: 100 }}
			>
				<div
					class="absolute inset-0 -z-10"
					onclick={() => (menuOpen = false)}
					aria-hidden="true"
				></div>

				<div
					class="flex max-h-full w-full max-w-sm flex-col overflow-hidden rounded-xl border-4 border-zinc-700 bg-zinc-800 p-4 shadow-2xl"
					transition:fly={{ duration: 300, y: prefersReducedMotion.current ? 0 : -10, opacity: 0 }}
				>
					<nav class="flex h-full w-full flex-col items-center justify-start gap-2">
						<a
							class="flex h-full w-full items-center justify-start gap-2 rounded-lg text-xl font-semibold"
							href="/"
						>
							<Server size="30" />
							Servers
						</a>
						<a
							class="flex h-full w-full items-center justify-start gap-2 rounded-lg text-xl font-semibold"
							href="https://titaniumbot.me/server"
							target="_blank"
						>
							<LifeBuoy size="30" />
							Support
						</a>
					</nav>
				</div>
			</div>
		{/if}
	</div>
</header>
