<script lang="ts">
	let { children }: { children?: any } = $props();
</script>

<div class="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4">
	{@render children?.()}
</div>
