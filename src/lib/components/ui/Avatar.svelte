<script lang="ts">
	const { src = '', name = '', size = 40, circle = false } = $props();
</script>

{#if src}
	<img
		class="inline-block {circle ? 'rounded-full' : 'rounded-md'} object-cover"
		translate="no"
		{src}
		alt={name}
		width={size}
		height={size}
		style="width: {size}px; height: {size}px;"
	/>
{:else}
	<div
		class="inline-flex items-center justify-center {circle
			? 'rounded-full'
			: 'rounded-md'} bg-zinc-700 text-zinc-400"
		style="width: {size}px; height: {size}px; font-size: {size / 2}px;"
		translate="no"
	>
		{name ? name.charAt(0) : ''}
	</div>
{/if}
