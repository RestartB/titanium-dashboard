<script lang="ts">
	import logo from '$lib/assets/logo.svg';
</script>

<header class="fixed h-12 w-full border-b-4 border-b-zinc-700 bg-zinc-800">
	<div class="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
		<div class="flex h-full items-center">
			<div class="mr-2 flex items-center gap-2">
				<img src={logo} alt="Titanium Logo" class="h-8 w-8 rounded-md" />
				<h1 class="font-bold">Titanium</h1>
			</div>
			<a href="/" class="flex h-full items-center px-2">Servers</a>
			<a href="https://docs.titaniumbot.me" target="_blank" class="flex h-full items-center px-2"
				>Docs</a
			>
			<a href="https://titaniumbot.me/server" target="_blank" class="flex h-full items-center px-2"
				>Support</a
			>
		</div>
		<div class="flex items-center gap-2">
			<img src={logo} alt="User Avatar" class="h-6 w-6 rounded-full bg-zinc-600" />
			<p>Hi, <strong>Restart</strong></p>
		</div>
	</div>
</header>
