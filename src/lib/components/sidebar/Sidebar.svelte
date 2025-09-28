<script lang="ts">
	import { page } from '$app/state';
	import type { ServerInfo } from '$lib/types/serverInfo';

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

<div
	class="flex w-full flex-shrink-0 flex-col gap-2 p-4"
	style="view-transition-name: sidebar"
>
	<div class="flex items-center gap-2">
		<Avatar src={serverInfo.icon} name={serverInfo.name} size={40} />
		<h2 class="font-bold" translate="no">{serverInfo.name}</h2>
	</div>
	<Tile
		title="Home"
		href="/{serverID}"
		Icon={House}
		active={page.url.pathname.endsWith(serverID)}
	/>
	<Tile
		title="General Settings"
		href="/{serverID}/general"
		Icon={Cog}
		active={page.url.pathname.endsWith('/general')}
	/>
	<Tile
		title="Permissions"
		href="/{serverID}/permissions"
		Icon={Key}
		active={page.url.pathname.endsWith('/permissions')}
	/>
	<Tile
		title="Error Log"
		href="/{serverID}/error-log"
		Icon={TriangleAlert}
		active={page.url.pathname.endsWith('/error-log')}
	/>
	<p class="ml-2 text-base font-bold text-zinc-300/60">FEATURES</p>
	<Tile
		title="Moderation"
		href="/{serverID}/moderation"
		Icon={Shield}
		active={page.url.pathname.endsWith('/moderation')}
	/>
	<Tile
		title="Automod"
		href="/{serverID}/automod"
		Icon={Brain}
		active={page.url.pathname.endsWith('/automod')}
	/>
	<Tile
		title="Bouncer"
		href="/{serverID}/bouncer"
		Icon={DoorClosedLocked}
		active={page.url.pathname.endsWith('/bouncer')}
	/>
	<Tile
		title="Logging"
		href="/{serverID}/logging"
		Icon={ScrollText}
		active={page.url.pathname.endsWith('/logging')}
	/>
	<Tile
		title="Fireboard"
		href="/{serverID}/fireboard"
		Icon={Flame}
		active={page.url.pathname.endsWith('/fireboard')}
	/>
	<Tile
		title="Leaderboard"
		href="/{serverID}/leaderboard"
		Icon={Trophy}
		active={page.url.pathname.endsWith('/leaderboard')}
	/>
	<Tile
		title="Server Counters"
		href="/{serverID}/server-counters"
		Icon={Tally5}
		active={page.url.pathname.endsWith('/server-counters')}
	/>
	<Tile
		title="Self Roles"
		href="/{serverID}/self-roles"
		Icon={Users}
		active={page.url.pathname.endsWith('/self-roles')}
	/>
</div>
