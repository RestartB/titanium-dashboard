<script lang="ts">
	import { page } from '$app/state';
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
</script>

<div class="flex w-full max-w-2xs flex-col gap-2">
	<div class="flex items-center gap-2">
		<span class="aspect-square h-10 w-10 rounded-md bg-zinc-600"></span>
		<h2 class="font-bold">SERVER NAME</h2>
	</div>
	<Tile title="Home" href="/123" Icon={House} active={page.url.pathname.endsWith("/123")} />
	<Tile title="General Settings" href="/123/general" Icon={Cog} active={page.url.pathname.endsWith("/general")} />
	<Tile title="Permissions" href="/123/permissions" Icon={Key} active={page.url.pathname.endsWith("/permissions")} />
	<Tile title="Error Log" href="/123/error-log" Icon={TriangleAlert} active={page.url.pathname.endsWith("/error-log")} />
	<p class="ml-2 text-base font-bold text-zinc-300/60">FEATURES</p>
	<Tile title="Moderation" href="/123/moderation" Icon={Shield} active={page.url.pathname.endsWith("/moderation")} />
	<Tile title="Automod" href="/123/automod" Icon={Brain} active={page.url.pathname.endsWith("/automod")} />
	<Tile title="Bouncer" href="/123/bouncer" Icon={DoorClosedLocked} active={page.url.pathname.endsWith("/bouncer")} />
	<Tile title="Logging" href="/123/logging" Icon={ScrollText} active={page.url.pathname.endsWith("/logging")} />
	<Tile title="Fireboard" href="/123/fireboard" Icon={Flame} active={page.url.pathname.endsWith("/fireboard")} />
	<Tile title="Leaderboard" href="/123/leaderboard" Icon={Trophy} active={page.url.pathname.endsWith("/leaderboard")} />
	<Tile title="Server Counters" href="/123/server-counters" Icon={Tally5} active={page.url.pathname.endsWith("/server-counters")} />
	<Tile title="Self Roles" href="/123/self-roles" Icon={Users} active={page.url.pathname.endsWith("/self-roles")} />
</div>
