<script lang="ts">
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

  import { typeDisplayNames } from '$lib/strings/serverCounters';
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

<FullscreenOverlay title="Select a Type" padding={8} gap={8} bind:overlayOpen>
  {@render typeRow('total_members', 'The total amount of users and bots in the server.')}
  {@render typeRow('users', 'The total amount of human users in the server.')}
  {@render typeRow('bots', 'The total amount of bots in the server.')}
  {@render typeRow('online_members', 'The total amount of users and bots that are online.')}
  {@render typeRow('offline_members', 'The total amount of users and bots that are offline.')}
  {@render typeRow('channels', 'The total amount of channels in the server.')}
  {@render typeRow('categories', 'The total amount of channel categories in the server.')}
  {@render typeRow('roles', 'The total amount of roles in the server.')}
  {@render typeRow('total_xp', 'The total amount of XP earned on the Titanium leaderboard in this server.')}
</FullscreenOverlay>
