<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import Row from '$lib/components/ui/row/Row.svelte';
	import { TriangleAlert } from '@lucide/svelte';

	let { page, dataState = $bindable() }: { page: string; dataState: any } = $props();

	let originalDataString = JSON.stringify(dataState);
	let hasUnsavedChanges = $state(false);
	let row: HTMLDivElement | undefined = $state();

	$effect(() => {
		const currentDataString = JSON.stringify(dataState);
		hasUnsavedChanges = originalDataString !== currentDataString;
	});

	beforeNavigate((nav) => {
		if (hasUnsavedChanges) {
			nav.cancel();
			row?.classList.add('animate-warning');

			if (row) {
				row.style.setProperty('background-color', 'oklch(44.4% 0.177 26.899)', 'important');
			}

			row?.addEventListener(
				'animationend',
				() => {
					row?.classList.remove('animate-warning');
					if (row) {
						row.style.removeProperty('background-color');
					}
				},
				{ once: true }
			);
		}
	});

	async function saveServerSettings() {
		await fetch(`/api/${dataState.server_info.id}/settings`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(dataState.server_settings)
		});
	}

	async function saveChanges() {
		await saveServerSettings();

		if (page === 'automod') {
			await fetch(`/api/${dataState.server_info.id}/module/automod`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(dataState.automod_settings)
			});
		} else if (page === 'logging') {
			await fetch(`/api/${dataState.server_info.id}/module/logging`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(dataState.logging_settings)
			});
		}

		originalDataString = JSON.stringify(dataState);
		hasUnsavedChanges = false;
	}

	function resetChanges() {
		dataState = JSON.parse(originalDataString);
		hasUnsavedChanges = false;
	}
</script>

{#if hasUnsavedChanges}
	<div
		class="pointer-events-none fixed inset-0 z-10 mt-12 flex flex-col items-center justify-end overflow-hidden p-4"
		transition:fly={{ y: 20, duration: 200 }}
	>
		<Row
			class="pointer-events-auto w-full max-w-180 bg-zinc-800/60 backdrop-blur-lg transition-colors"
			bind:thisElement={row}
		>
			<div class="flex h-full w-full items-center justify-between gap-4">
				<div class="flex items-center gap-2">
					<TriangleAlert size={20} />
					<p>You have unsaved changes.</p>
				</div>
				<div class="flex items-center justify-center gap-2">
					<button
						class="cursor-pointer rounded-lg bg-zinc-600 px-2 py-1 transition-colors hover:bg-zinc-500"
						onclick={resetChanges}>Reset</button
					>
					<button
						class="cursor-pointer rounded-lg bg-green-600 px-2 py-1 transition-colors hover:bg-green-500"
						onclick={saveChanges}>Save changes</button
					>
				</div>
			</div>
		</Row>
	</div>
{/if}
