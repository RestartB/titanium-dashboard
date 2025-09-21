<script lang="ts">
	const { userData }: { userData?: any | null | undefined } = $props();
	import logo from '$lib/assets/logo.svg';
</script>

<header
	class="fixed h-12 w-full border-b-4 border-b-zinc-700 bg-zinc-800"
	style="view-transition-name: header"
>
	<div class="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
		<div class="flex h-full items-center">
			<div class="mr-2 flex items-center gap-2">
				<img src={logo} alt="Titanium" class="h-8 w-8 rounded-md" translate="no" />
				<h1 class="font-bold" translate="no">Titanium</h1>
			</div>
			{#if userData}
				<a href="/" class="flex h-full items-center px-2">Servers</a>
			{/if}
			<a href="https://titaniumbot.me/server" target="_blank" class="flex h-full items-center px-2"
				>Support</a
			>
		</div>
		<div class="flex items-center gap-2">
			{#if userData}
				<img src={logo} alt="User Avatar" class="h-6 w-6 rounded-full bg-zinc-600" translate="no" />
				<p class="font-bold" translate="no">{userData?.global_name || userData?.username}</p>
			{:else}
				<p class="font-bold opacity-70">Not logged in</p>
			{/if}
		</div>
	</div>
</header>
