<script lang="ts">
  import { X } from '@lucide/svelte';
  import { typeDisplayNames } from '$lib/strings/server_counters';
  import type { ServerCounterChannelSchema } from '$lib/validators/serverCounters';

  let {
    channel = $bindable(),
    overlayOpen = $bindable(true)
  }: { channel: ServerCounterChannelSchema; overlayOpen?: boolean } = $props();
</script>

{#snippet typeRow(type: ServerCounterChannelSchema['type'], description: string)}
  <button
    class="flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 px-4 transition-all hover:bg-zinc-800"
    onclick={() => {
      channel.type = type;
      overlayOpen = false;
    }}
    aria-label="Select {typeDisplayNames[type]} type"
  >
    <div class="w-full text-left">
      <p class="font-medium">{typeDisplayNames[type]}</p>
      <p class="text-sm text-zinc-400">{description}</p>
    </div>
  </button>
{/snippet}

<div
  class="flex w-full max-w-104 flex-col items-center justify-center gap-4 rounded-xl border-2 border-zinc-600 bg-zinc-800 p-4"
>
  <div class="flex w-full items-center justify-between gap-2">
    <h2 class="text-xl font-bold">Select a Type</h2>
    <button
      class="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
      onclick={() => (overlayOpen = false)}
      aria-label="Close type selector"
    >
      <X class="h-6 w-6" />
    </button>
  </div>
  <div
    class="flex h-full max-h-104 min-h-104 w-full max-w-96 flex-shrink-0 flex-col rounded-xl border-2 border-zinc-600 bg-zinc-700"
  >
    <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
      {@render typeRow('total_members', 'The total amount of users and bots in the server.')}
      {@render typeRow('users', 'The total amount of human users in the server.')}
      {@render typeRow('bots', 'The total amount of bots in the server.')}
      {@render typeRow('online_members', 'The total amount of users and bots that are not offline.')}
      {@render typeRow('offline_members', 'The total amount of users and bots that are offline.')}
      {@render typeRow('members_status_online', 'The total amount of users and bots that are online.')}
      {@render typeRow('members_status_idle', 'The total amount of users and bots that are idle.')}
      {@render typeRow('members_status_dnd', 'The total amount of users and bots that are set to Do Not Disturb.')}
      {@render typeRow(
        'members_activity',
        'The total amount of users and bots that are in an activity (playing a game, listening to Spotify, etc).'
      )}
      {@render typeRow('members_custom_status', 'The total amount of users and bots that have a custom status set.')}
      {@render typeRow('activity', 'The amount of users doing a specific activity.')}
    </div>
  </div>
</div>
