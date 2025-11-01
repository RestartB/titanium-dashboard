<script lang="ts">
  import { page } from '$app/state';
  import type { ServerInfo } from '$lib/interfaces/serverInfo';

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
    Users
  } from '@lucide/svelte';
  import Tile from './Tile.svelte';
  import Avatar from '$lib/components/ui/Avatar.svelte';

  const { serverInfo }: { serverInfo: ServerInfo } = $props();
  const serverID = serverInfo.id;
</script>

<div class="flex w-full flex-shrink-0 flex-col gap-2 p-4" style="view-transition-name: sidebar">
  <div class="flex items-center gap-2">
    <Avatar src={serverInfo.icon} name={serverInfo.name} size={40} />
    <h2 class="font-bold" translate="no">{serverInfo.name}</h2>
  </div>
  <Tile
    title="Home"
    href="/guild/{serverID}"
    Icon={House}
    active={page.url.pathname.endsWith(serverID)}
  />
  <Tile
    title="General Settings"
    href="/guild/{serverID}/general"
    Icon={Cog}
    active={page.url.pathname.endsWith('/general')}
  />
  <Tile
    title="Permissions"
    href="/guild/{serverID}/permissions"
    Icon={Key}
    active={page.url.pathname.endsWith('/permissions')}
  />
  <Tile
    title="Error Log"
    href="/guild/{serverID}/errors"
    Icon={TriangleAlert}
    active={page.url.pathname.endsWith('/errors')}
  />
  <p class="ml-2 text-base font-bold text-zinc-300/60">FEATURES</p>
  <Tile
    title="Moderation"
    href="/guild/{serverID}/moderation"
    Icon={Shield}
    active={page.url.pathname.endsWith('/moderation')}
  />
  <Tile
    title="Automod"
    href="/guild/{serverID}/automod"
    Icon={Brain}
    active={page.url.pathname.endsWith('/automod')}
  />
  <Tile
    title="Bouncer"
    href="/guild/{serverID}/bouncer"
    Icon={DoorClosedLocked}
    active={page.url.pathname.endsWith('/bouncer')}
  />
  <Tile
    title="Logging"
    href="/guild/{serverID}/logging"
    Icon={ScrollText}
    active={page.url.pathname.endsWith('/logging')}
  />
  <Tile
    title="Fireboard"
    href="/guild/{serverID}/fireboard"
    Icon={Flame}
    active={page.url.pathname.endsWith('/fireboard')}
  />
  <Tile
    title="Leaderboard"
    href="/guild/{serverID}/leaderboard"
    Icon={Trophy}
    active={page.url.pathname.endsWith('/leaderboard')}
  />
  <Tile
    title="Server Counters"
    href="/guild/{serverID}/server_counters"
    Icon={Tally5}
    active={page.url.pathname.endsWith('/server_counters')}
  />
  <Tile
    title="Self Roles"
    href="/guild/{serverID}/self-roles"
    Icon={Users}
    active={page.url.pathname.endsWith('/self-roles')}
  />
</div>
