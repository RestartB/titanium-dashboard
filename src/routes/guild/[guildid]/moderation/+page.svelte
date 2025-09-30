<script lang="ts">
	import Row from '$lib/components/ui/row/Row.svelte';
</script>

<div>
	<h2 class="text-4xl font-bold">Moderation</h2>
	<p>Moderate your server and manage cases.</p>
</div>

<Row>
	<div>
		<h2 class="text-xl font-bold">Delete Confirmation Messages</h2>
		<p>
			Titanium will send a confirmation message to the current channel once a moderation action has
			been completed. When this option is enabled, the confirmation messages will delete
			automatically after 5 seconds.
		</p>
	</div>
</Row>

<Row>
	<div>
		<h2 class="text-xl font-bold">DM Users</h2>
		<p>
			When this option is enabled, Titanium will attempt to DM users when a moderation action is
			performed on them. This includes actions like bans, kicks, mutes, and warnings.
		</p>
	</div>
</Row>

<Row>
	<div>
		<h2 class="text-xl font-bold">Immune Roles</h2>
		<p>
			By default, Titanium will respect the role hierarchy when performing moderation actions.
			However, you can set specific roles to be immune from all moderation actions that are
			performed with Titanium.
		</p>
	</div>
</Row>
