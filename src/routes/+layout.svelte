<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';

	let { children, data } = $props();

	const pageOrder: Record<string, number> = {
		home: 0,
		general: 1,
		automod: 2,
		logging: 3
	};

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		if (!navigation.to || !navigation.from) return;
		if (navigation.to.url.href === navigation.from.url.href) return;

		let fromPageID = navigation.from.url.pathname.split('/').pop() || '';
		let toPageID = navigation.to.url.pathname.split('/').pop() || '';

		if (fromPageID === page.params.guildid) fromPageID = 'home';
		if (toPageID === page.params.guildid) toPageID = 'home';

		if (pageOrder[fromPageID] === undefined || pageOrder[toPageID] === undefined) return;
		if (pageOrder[fromPageID] === pageOrder[toPageID]) return;

		const isForward = pageOrder[toPageID] > pageOrder[fromPageID];

		document.documentElement.style.setProperty(
			'--old-animation',
			isForward ? 'slide-to-top' : 'slide-to-bottom'
		);
		document.documentElement.style.setProperty(
			'--new-animation',
			isForward ? 'slide-from-bottom' : 'slide-from-top'
		);

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>Titanium Dashboard</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen flex-col">
	<Header userData={data.userData.userData} />
	<div class="flex-1 overflow-hidden pt-12">
		{@render children?.()}
	</div>
</div>

<style>
	:root::view-transition-old(root) {
		animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both var(--old-animation);
	}

	:root::view-transition-new(root) {
		animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both var(--new-animation);
	}
</style>
