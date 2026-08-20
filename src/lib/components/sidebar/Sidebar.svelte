<script lang="ts">
  import { page } from '$app/state';
  import type { ServerBranding } from '$lib/interfaces/serverInfo';

  import {
    House,
    Cog,
    Key,
    TriangleAlert,
    Shield,
    Brain,
    DoorClosedLocked,
    ScrollText,
    Flame,
    Trophy,
    Tally5,
    HatGlasses,
    Tag,
    ThumbsUp
  } from '@lucide/svelte';
  import Tile from './Tile.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';

  const { serverBranding }: { serverBranding: ServerBranding } = $props();
  const serverId = serverBranding.id;
</script>

<div class="flex w-full shrink-0 flex-col gap-2 p-4" style="view-transition-name: sidebar">
  <div class="flex items-center gap-2">
    <Avatar src={serverBranding.icon || ''} name={serverBranding.name} size={40} />
    <div class="overflow-hidden">
      <h2 class="overflow-hidden font-bold text-nowrap text-ellipsis" translate="no">{serverBranding.name}</h2>
      {#if serverBranding.member_count}
        <p class="overflow-hidden text-sm text-nowrap text-ellipsis">
          {serverBranding.member_count.toLocaleString()} members
        </p>
      {/if}
    </div>
  </div>

  <!-- prettier-ignore -->
  <Tile
    title="Home"
    href="/guild/{serverId}"
    Icon={House}
    active={page.url.pathname.endsWith(serverId)}
  />
  <Tile
    title="General Settings"
    href="/guild/{serverId}/general"
    Icon={Cog}
    active={page.url.pathname.endsWith('/general')}
  />
  <Tile
    title="Permissions"
    href="/guild/{serverId}/permissions"
    Icon={Key}
    active={page.url.pathname.endsWith('/permissions')}
  />
  <Tile
    title="Error Log"
    href="/guild/{serverId}/errors"
    Icon={TriangleAlert}
    active={page.url.pathname.endsWith('/errors')}
  />

  <p class="ml-2 text-base font-bold text-zinc-300/60">FEATURES</p>
  <Tile
    title="Moderation"
    href="/guild/{serverId}/moderation"
    Icon={Shield}
    active={page.url.pathname.endsWith('/moderation') || page.url.pathname.includes('/moderation/cases')}
  />
  <!-- prettier-ignore -->
  <Tile
    title="Automod"
    href="/guild/{serverId}/automod"
    Icon={Brain}
    active={page.url.pathname.endsWith('/automod')}
  />
  <Tile
    title="Bouncer"
    href="/guild/{serverId}/bouncer"
    Icon={DoorClosedLocked}
    active={page.url.pathname.endsWith('/bouncer')}
  />
  <Tile
    title="Logging"
    href="/guild/{serverId}/logging"
    Icon={ScrollText}
    active={page.url.pathname.endsWith('/logging')}
  />
  <Tile
    title="Fireboard"
    href="/guild/{serverId}/fireboard"
    Icon={Flame}
    active={page.url.pathname.endsWith('/fireboard')}
  />
  <Tile
    title="Leaderboard"
    href="/guild/{serverId}/leaderboard"
    Icon={Trophy}
    active={page.url.pathname.endsWith('/leaderboard')}
  />
  <Tile
    title="Server Counters"
    href="/guild/{serverId}/server_counters"
    Icon={Tally5}
    active={page.url.pathname.endsWith('/server_counters')}
  />
  <Tile
    title="Confessions"
    href="/guild/{serverId}/confessions"
    Icon={HatGlasses}
    active={page.url.pathname.endsWith('/confessions')}
  />
  <!-- prettier-ignore -->
  <Tile
    title="Tags"
    href="/guild/{serverId}/tags"
    Icon={Tag}
    active={page.url.pathname.endsWith('/tags')}
  />
  <!-- prettier-ignore -->
  <Tile
    title="Rep"
    href="/guild/{serverId}/rep"
    Icon={ThumbsUp}
    active={page.url.pathname.endsWith('/rep')}
  />
</div>
