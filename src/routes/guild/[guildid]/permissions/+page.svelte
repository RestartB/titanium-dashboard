<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
</script>

<div>
  <h2 class="text-4xl font-bold">Permissions</h2>
  <p>Change the permissions for Titanium's commands and dashboard access.</p>
</div>

<Row>
  <div>
    <h2 class="text-xl font-bold">Dashboard Managers</h2>
    <p>
      Dashboard Managers can fully manage Titanium from the dashboard, however, they will not have
      any special access to Titanium's commands past what their roles already provide.
    </p>
  </div>
</Row>

<Row>
  <div>
    <h2 class="text-xl font-bold">Case Managers</h2>
    <p>
      Case Managers can view and manage moderation cases with the dashboard. This is useful for
      moderators to get an easier view of the server's cases. Roles with the Manage Server
      permission will automatically be Case Managers, but you can also add roles manually below.
    </p>
  </div>
</Row>
