<script lang="ts">
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
    BadgeCheck
  } from '@lucide/svelte';
  import type { Component } from 'svelte';

  const { data } = $props();
  const serverID = data.serverInfo.id;
  const userData = data.userData?.userData;
</script>

{#snippet featureCard(title: string, description: string, href: string, Icon: Component)}
  <a
    class="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4 shadow-lg transition-all hover:scale-102 hover:bg-zinc-700"
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
    Hi there, <span
      class="bg-linear-to-r from-zinc-100 to-zinc-400 bg-clip-text font-bold text-transparent"
      translate="no">{userData?.global_name || userData?.username}</span
    >
  </h1>
  <p>
    Manage settings for Titanium in <strong translate="no">{data.serverInfo.name}</strong> here.
  </p>
</div>

<div class="grid grid-cols-1 gap-4 xxs:grid-cols-2 lg:grid-cols-3">
  {@render featureCard(
    'General Settings',
    'Change general settings like prefixes and reply types.',
    `/guild/${serverID}/general`,
    Cog
  )}
  {@render featureCard(
    'Permissions',
    'Change permissions for different features in your server.',
    `/guild/${serverID}/permissions`,
    Key
  )}
  {@render featureCard(
    'Error Log',
    'View and manage error logs for your server.',
    `/guild/${serverID}/errors`,
    TriangleAlert
  )}
</div>

<p class="text-base font-bold text-zinc-300/60">FEATURES</p>

<div class="grid grid-cols-1 gap-4 xxs:grid-cols-2 lg:grid-cols-3">
  {@render featureCard(
    'Moderation',
    'Moderate your server members and manage cases.',
    `/guild/${serverID}/moderation`,
    Shield
  )}
  {@render featureCard(
    'Automod',
    'Allow Titanium to moderate your server for you.',
    `/guild/${serverID}/automod`,
    Brain
  )}
  {@render featureCard(
    'Bouncer',
    'Allow Titanium to monitor users as they join.',
    `/guild/${serverID}/bouncer`,
    DoorClosedLocked
  )}
  {@render featureCard(
    'Logging',
    'Log various events that happen in your server.',
    `/guild/${serverID}/logging`,
    ScrollText
  )}
  {@render featureCard(
    'Fireboard',
    'Let server members highlight messages they love.',
    `/guild/${serverID}/fireboard`,
    Flame
  )}
  {@render featureCard(
    'Leaderboard',
    'Track engagement and activity in your server.',
    `/guild/${serverID}/leaderboard`,
    Trophy
  )}
  {@render featureCard(
    'Server Counters',
    'Display various server statistics and counters.',
    `/guild/${serverID}/server_counters`,
    Tally5
  )}
  {@render featureCard(
    'Confessions',
    'Allow server members to make anonymous confessions.',
    `/guild/${serverID}/confessions`,
    BadgeCheck
  )}
</div>
