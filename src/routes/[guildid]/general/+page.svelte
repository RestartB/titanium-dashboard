<script lang="ts">
	import { Row, ToggleRow } from '$lib/components/ui/row';

	let toggled = $state(false);
</script>

<div>
	<h2 class="text-4xl font-bold">General Settings</h2>
	<p>Change general settings like prefixes and reply types.</p>
</div>

<Row>
	<h2 class="text-xl font-bold">Prefixes</h2>
	<p>
		Create and delete up to 5 prefixes that Titanium responds to. You can also mention Titanium or
		use slash commands.
	</p>
</Row>

<ToggleRow bind:toggled>
	<div>
		<h2 class="text-xl font-bold">Show Loading Reaction</h2>
		<p>
			Enable or disable the loading reaction that appears when Titanium is processing a prefix
			command. The loading indicator will always show for slash commands.
		</p>
	</div>
</ToggleRow>

<ToggleRow bind:toggled>
	<div>
		<h2 class="text-xl font-bold">Use Reply Pings</h2>
		<p>Control whether Titanium should use reply pings when responding to prefix commands.</p>
	</div>
</ToggleRow>
