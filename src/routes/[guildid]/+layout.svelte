<script lang="ts">
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	let { children } = $props();
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-7xl gap-4 p-4">
		<Sidebar />

		<div class="flex flex-col gap-4">
			{@render children?.()}
		</div>
	</div>
</div>
