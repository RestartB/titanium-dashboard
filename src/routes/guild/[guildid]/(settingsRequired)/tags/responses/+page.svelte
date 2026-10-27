<script lang="ts">
  import { resolve } from '$app/paths';

  import Saver from '$lib/components/Saver.svelte';
  import QuickResponse from '$lib/components/tags/QuickResponse.svelte';
  import ChannelTile from '$lib/components/ui/discord/ChannelTile.svelte';
  import RoleTile from '$lib/components/ui/discord/RoleTile.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Row from '$lib/components/ui/row/Row.svelte';
  import { ChevronLeft, Plus } from '@lucide/svelte';

  const { data } = $props();
  let dataState = $state(data);

  let channelOverlayOpen = $state(false);
  let roleOverlayOpen = $state(false);
</script>

{#if channelOverlayOpen}
  <ChannelPicker
    multiselect={true}
    categories={data.serverInfo.categories}
    bind:selectedChannels={dataState.pageSettings.global_ignored_channels}
    bind:overlayOpen={channelOverlayOpen}
  />
{/if}

{#if roleOverlayOpen}
  <RolePicker
    multiselect={true}
    roles={data.serverInfo.roles}
    bind:selectedRoles={dataState.pageSettings.global_ignored_roles}
    bind:overlayOpen={roleOverlayOpen}
  />
{/if}

<Saver {data} page="tags" bind:dataState />

<a href={resolve(`/guild/${data.serverBranding.id}/tags`)} class="back-button group flex w-fit items-center">
  <ChevronLeft
    size={32}
    class="shrink-0 -translate-x-2 transition-transform duration-200 ease-in-out group-hover:-translate-x-3"
  />

  <p class="-ml-1">Tags</p>
</a>

<div>
  <h2 class="text-4xl font-bold">Quick Responses</h2>
  <p>Create quick responses to send tags quicker. When a message starts with your keyword, the tag will be sent.</p>
</div>

<hr class="border-zinc-500" />
<p class="text-base font-bold text-zinc-300/60">Global Ignored Roles & Channels</p>

<Row>
  <h2 class="text-xl font-bold">Global Blocked Channels</h2>
  <p class="mb-2">Select up to 100 channels that all quick responses will ignore.</p>

  <div class="flex flex-wrap gap-2">
    {#if dataState.pageSettings.global_ignored_channels.length < 100}
      <Button smallPadding={true} onclick={() => (channelOverlayOpen = true)}>
        <Plus size={20} />
        Add channels...
      </Button>
    {/if}

    {#each dataState.pageSettings.global_ignored_channels as channel (channel)}
      <ChannelTile
        {channel}
        categories={data.serverInfo.categories}
        deleteThis={() => {
          dataState.pageSettings.global_ignored_channels = dataState.pageSettings.global_ignored_channels.filter(
            (c) => c !== channel
          );
        }}
      />
    {/each}
  </div>
</Row>

<Row>
  <h2 class="text-xl font-bold">Global Blocked Roles</h2>
  <p class="mb-2">Select up to 100 roles that that all quick responses will ignore messages from.</p>

  <div class="flex flex-wrap gap-2">
    {#if dataState.pageSettings.global_ignored_roles.length < 100}
      <Button smallPadding={true} onclick={() => (roleOverlayOpen = true)}><Plus size={20} /> Add roles...</Button>
    {/if}

    {#each dataState.pageSettings.global_ignored_roles as role (role)}
      {@const foundRole = dataState.serverInfo.roles.find((r) => r.id === role)}
      <RoleTile
        role={foundRole || role}
        deleteThis={() => {
          dataState.pageSettings.global_ignored_roles = dataState.pageSettings.global_ignored_roles.filter(
            (r) => r !== role
          );
        }}
      />
    {/each}
  </div>
</Row>

<hr class="border-zinc-500" />
<p class="text-base font-bold text-zinc-300/60">Quick Responses</p>

<Button
  onclick={() => {
    dataState.pageSettings.quick_responses.push({
      id: crypto.randomUUID(),
      tag_id: undefined,
      keywords: [],
      match_whole_word: true,
      case_sensitive: false,
      ignored_channels: [],
      ignored_roles: []
    });
  }}
>
  <Plus size={20} /> Add response
</Button>

{#each dataState.pageSettings.quick_responses as response, i (response.id)}
  <QuickResponse
    bind:response={dataState.pageSettings.quick_responses[i]}
    tags={dataState.tags}
    serverInfo={dataState.serverInfo}
    deleteThis={() => dataState.pageSettings.quick_responses.splice(i, 1)}
  />
{/each}
