<script lang="ts">
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	let { children, data } = $props();

	let server_info = data.server_info;
</script>

<div class="flex h-full justify-center">
	<div class="flex w-full max-w-7xl">
		<Sidebar {server_info} />

		<div class="flex w-full flex-col gap-4 overflow-y-auto p-4">
			{@render children?.()}
		</div>
	</div>
</div>
