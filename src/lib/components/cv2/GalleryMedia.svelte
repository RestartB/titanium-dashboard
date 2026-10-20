<script lang="ts">
  let { src }: { src: string } = $props();

  type MediaKind = 'image' | 'video';

  function getPreferredKind(url: string): MediaKind {
    try {
      return /\.(mp4|webm|mov)$/i.test(new URL(url).pathname) ? 'video' : 'image';
    } catch {
      return 'image';
    }
  }

  let preferredKind = $derived(getPreferredKind(src));
  let preferredFailed = $state(false);
  let fallbackFailed = $state(false);
  let activeKind = $derived<MediaKind>(
    preferredFailed ? (preferredKind === 'image' ? 'video' : 'image') : preferredKind
  );

  function handleError() {
    if (preferredFailed) {
      fallbackFailed = true;
    } else {
      preferredFailed = true;
    }
  }
</script>

{#if !src.trim()}
  <div class="media-error">Enter a media URL</div>
{:else if fallbackFailed}
  <div class="media-error">Could not preview media</div>
{:else if activeKind === 'video'}
  <video {src} controls muted playsinline preload="metadata" onerror={handleError}></video>
{:else}
  <img {src} alt="" onerror={handleError} />
{/if}

<style>
  img,
  video,
  .media-error {
    width: 100%;
    height: 100%;
    min-width: 0;
    object-fit: cover;
  }

  .media-error {
    display: grid;
    place-items: center;
    padding: 1rem;
    background-color: var(--color-zinc-700);
    color: var(--color-zinc-400);
    text-align: center;
  }
</style>
