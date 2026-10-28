<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import WordTile from '$lib/components/ui/WordTile.svelte';
  import TagPicker from '$lib/components/pickers/TagPicker.svelte';
  import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';
  import RoleTile from '$lib/components/ui/discord/RoleTile.svelte';
  import Button from '$lib/components/ui/inputs/Button.svelte';
  import Toggle from '$lib/components/ui/inputs/Toggle.svelte';
  import ChannelTile from '$lib/components/ui/discord/ChannelTile.svelte';
  import ChannelPicker from '$lib/components/pickers/ChannelPicker.svelte';
  import RolePicker from '$lib/components/pickers/RolePicker.svelte';
  import { Menu, Plus, Trash } from '@lucide/svelte';

  import type { TagQuickResponseSchema } from '$lib/validators/tags';
  import type { TagsId } from '$lib/interfaces/tags';
  import type { ServerInfo } from '$lib/interfaces/serverInfo';

  let {
    response = $bindable(),
    tags,
    serverInfo,
    deleteThis
  }: { response: TagQuickResponseSchema; tags: TagsId[]; serverInfo: ServerInfo; deleteThis: () => void } = $props();

  let overlayOpen = $state(false);
  let ignoredOverlayOpen = $state(false);
  let channelPickerOpen = $state(false);
  let rolePickerOpen = $state(false);

  let selectedTag: TagsId | undefined = $derived(tags.filter((tag) => tag.id === response.tag_id)[0]);
  let newWordInput = $state('');
</script>

{#if overlayOpen}
  <TagPicker {tags} bind:selectedTag={response.tag_id} bind:overlayOpen />
{/if}

{#if channelPickerOpen}
  <ChannelPicker
    multiselect={true}
    categories={serverInfo.categories}
    bind:selectedChannels={response.ignored_channels}
    bind:overlayOpen={channelPickerOpen}
  />
{/if}

{#if rolePickerOpen}
  <RolePicker
    multiselect={true}
    roles={serverInfo.roles}
    bind:selectedRoles={response.ignored_roles}
    bind:overlayOpen={rolePickerOpen}
  />
{/if}

{#if ignoredOverlayOpen}
  <FullscreenOverlay title="Ignored Channels & Roles" padding={16} gap={16} bind:overlayOpen={ignoredOverlayOpen}>
    <div class="w-full text-left">
      <p class="font-medium">Ignored Channels</p>
      <p class="mb-2 text-sm text-zinc-400">
        Select up to 100 channels that this quick response will ignore messages from.
      </p>

      <div class="mt-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-800 p-2">
        {#if response.ignored_channels.length < 100}
          <Button
            class="border-2 border-zinc-600! bg-zinc-700!"
            smallPadding={true}
            onclick={() => (channelPickerOpen = true)}
          >
            Add channels...
          </Button>
        {/if}

        {#each response.ignored_channels as channel (channel)}
          <ChannelTile
            {channel}
            categories={serverInfo.categories}
            deleteThis={() => {
              response.ignored_channels = response.ignored_channels.filter((c) => c !== channel);
            }}
          />
        {/each}
      </div>
    </div>

    <div class="w-full text-left">
      <p class="font-medium">Ignored Roles</p>
      <p class="mb-2 text-sm text-zinc-400">
        Select up to 100 roles that this quick response will ignore messages from.
      </p>

      <div class="mt-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-800 p-2">
        {#if response.ignored_roles.length < 100}
          <Button
            class="border-2 border-zinc-600! bg-zinc-700!"
            smallPadding={true}
            onclick={() => (rolePickerOpen = true)}
          >
            Add roles...
          </Button>
        {/if}

        {#each response.ignored_roles as role (role)}
          {@const foundRole = serverInfo.roles.find((r) => r.id === role)}
          <RoleTile
            role={foundRole || role}
            deleteThis={() => {
              response.ignored_roles = response.ignored_roles.filter((r) => r !== role);
            }}
          />
        {/each}
      </div>
    </div>
  </FullscreenOverlay>
{/if}

<Row class="space-y-2">
  <div class="flex items-center gap-2">
    <button
      class="mr-auto flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-zinc-700 p-1 px-2 transition-colors hover:bg-zinc-600"
      onclick={() => (overlayOpen = !overlayOpen)}
      aria-label="Toggle tag selector"
    >
      <p class:opacity-50={!selectedTag}>{selectedTag?.name || 'No tag selected'}</p>
    </button>

    <button
      class="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-2 text-base transition-colors hover:bg-zinc-600 sm:p-1"
      onclick={() => (ignoredOverlayOpen = true)}
      aria-label="Delete quick response"
    >
      <Menu size={16} class="shrink-0" />
      <p class="hidden sm:block">Ignored Channels & Roles</p>
    </button>
    <button
      class="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-red-600 bg-red-700 p-2 text-base transition-colors hover:bg-red-600 sm:p-1"
      onclick={deleteThis}
      aria-label="Delete quick response"
    >
      <Trash size={16} class="shrink-0" />
      <p class="hidden sm:block">Delete</p>
    </button>
  </div>

  <div class="space-y-2">
    <div>
      <h2 class="font-bold">Keywords</h2>
      <p>When a message starts with one of these keywords, the tag is sent.</p>
    </div>

    <div class="my-2 flex h-fit w-full flex-wrap gap-2 rounded-lg bg-zinc-700 p-2">
      <div
        class="flex max-w-40 items-center justify-center gap-2 rounded-lg border-2 border-zinc-600 bg-zinc-700 p-1 px-2 text-base"
        class:cursor-not-allowed={response.keywords.length >= 5}
      >
        <input
          type="text"
          placeholder="Add Word..."
          class="h-full w-full disabled:cursor-not-allowed disabled:opacity-50"
          disabled={response.keywords.length >= 5}
          onkeydown={(e) => {
            if (e.key === 'Enter' && newWordInput) {
              response.keywords.push(newWordInput);
              newWordInput = '';
            }
          }}
          bind:value={newWordInput}
        />
        <button
          class="cursor-pointer rounded-lg p-1 transition-colors hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={response.keywords.length >= 5}
          onclick={() => {
            if (newWordInput) {
              response.keywords.push(newWordInput);
              newWordInput = '';
            }
          }}
          aria-label="Add word"
        >
          <Plus size={16} />
        </button>
      </div>

      {#if response.keywords}
        {#each response.keywords as word, index (index)}
          <WordTile deleteThis={() => response.keywords.splice(index, 1)} {word} />
        {/each}
      {/if}
    </div>
  </div>

  <div class="flex flex-wrap items-center gap-4">
    <label class="inline-flex items-center gap-2 align-middle">
      <Toggle bind:toggled={response.match_whole_word} />
      <span>Match whole word</span>
    </label>
    <label class="inline-flex items-center gap-2 align-middle">
      <Toggle bind:toggled={response.case_sensitive} />
      <span>Case sensitive</span>
    </label>
  </div>
</Row>
