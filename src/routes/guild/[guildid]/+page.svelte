<script lang="ts">
  import { DiscordPermission, hasDiscordPermission } from '$lib/helpers/discord';

  import Alert from '$lib/components/ui/Alert.svelte';
  import {
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

  import type { ResolvedPathname } from '$app/types';
  import type { Component } from 'svelte';

  const { data } = $props();
  const serverId = data.serverBranding.id;
  const userData = data.userData?.userData;

  // eslint-disable-next-line no-useless-assignment
  let greeting = $state('');

  // decide greeting based on browser time
  const time = new Date().getHours();
  if (time > 5 && time < 12) {
    greeting = 'Good morning, ';
  } else if (time >= 12 && time < 19) {
    greeting = 'Good afternoon, ';
  } else {
    greeting = 'Good evening, ';
  }
</script>

{#snippet featureCard(title: string, description: string, href: ResolvedPathname, Icon: Component)}
  <a
    class="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4 shadow-lg transition-all hover:scale-102 hover:bg-zinc-700 active:scale-98"
    {href}
  >
    <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-600">
      <Icon size={28} />
    </div>
    <h2 class="font-xl font-bold">{title}</h2>
    <p>{description}</p>
  </a>
{/snippet}

<div>
  <h1 class="text-4xl">
    {greeting || 'Hi there, '}
    <span class="bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text font-bold text-transparent" translate="no">
      {userData?.global_name || userData?.username}
    </span>
  </h1>
  <p>
    Manage settings for Titanium in <strong translate="no">{data.serverBranding.name}</strong> here.
  </p>
</div>

{#if !data.serverInfo || !hasDiscordPermission(BigInt(data.serverInfo.bot_permissions), DiscordPermission.ViewChannel | DiscordPermission.SendMessages)}
  <Alert>
    Titanium is missing critical permissions (view channels and send messages). It will not function correctly until it
    has these permissions.
  </Alert>
{/if}

<div class="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
  {@render featureCard(
    'General Settings',
    'Change general settings like prefixes and reply types.',
    `/guild/${serverId}/general`,
    Cog
  )}
  {@render featureCard(
    'Permissions',
    'Change who can access the Titanium dashboard.',
    `/guild/${serverId}/permissions`,
    Key
  )}
  {@render featureCard(
    'Error Log',
    'View and manage error logs for your server.',
    `/guild/${serverId}/errors`,
    TriangleAlert
  )}
</div>

<p class="text-base font-bold text-zinc-300/60">FEATURES</p>

<div class="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
  {@render featureCard(
    'Moderation',
    'Moderate your server members and manage cases.',
    `/guild/${serverId}/moderation`,
    Shield
  )}
  {@render featureCard(
    'Automod',
    'Allow Titanium to moderate your server for you.',
    `/guild/${serverId}/automod`,
    Brain
  )}
  {@render featureCard(
    'Bouncer',
    'Monitor users as they join and update their profiles.',
    `/guild/${serverId}/bouncer`,
    DoorClosedLocked
  )}
  {@render featureCard(
    'Logging',
    'Log various events that happen in your server.',
    `/guild/${serverId}/logging`,
    ScrollText
  )}
  {@render featureCard(
    'Fireboard',
    'Let server members highlight messages they love.',
    `/guild/${serverId}/fireboard`,
    Flame
  )}
  {@render featureCard(
    'Leaderboard',
    'Track engagement and activity in your server.',
    `/guild/${serverId}/leaderboard`,
    Trophy
  )}
  {@render featureCard(
    'Server Counters',
    'Display various server statistics and counters.',
    `/guild/${serverId}/server_counters`,
    Tally5
  )}
  {@render featureCard(
    'Confessions',
    'Allow server members to make anonymous confessions.',
    `/guild/${serverId}/confessions`,
    HatGlasses
  )}
  <!-- prettier-ignore -->
  {@render featureCard(
    'Tags',
    'Send server wide quick responses with key words.',
    `/guild/${serverId}/tags`,
    Tag
  )}
  <!-- prettier-ignore -->
  {@render featureCard(
    'Rep',
    'Thank members by giving them rep points.',
    `/guild/${serverId}/rep`,
    ThumbsUp
  )}
</div>
