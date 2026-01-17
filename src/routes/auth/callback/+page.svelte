<script lang="ts">
  import { onMount } from 'svelte';

  import Row from '$lib/components/ui/row/Row.svelte';
  import logo from '$lib/assets/logo.svg';

  import { LoaderCircle, X } from '@lucide/svelte';
  import LogIn from '$lib/components/ui/discord/LogIn.svelte';

  const { data } = $props();
  let failed: string | undefined = $state();

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(';').shift() || '');
    }
    return null;
  };

  onMount(() => {
    if (data.tokenValid) {
      // already logged in, redirect to home
      window.location.href = '/';
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      failed = 'Missing Code';
      return;
    }

    const state = params.get('state');
    const stateCookie = getCookie('titanium_state');

    if (!state || !stateCookie || state !== stateCookie) {
      failed = 'Invalid State';
      return;
    }

    // get redirect from state
    const stateParts = state.split('-');
    const redirectPart = stateParts.slice(2).join('-');
    const redirectTo = redirectPart ? decodeURIComponent(atob(redirectPart)) : '/';

    if (!redirectTo.startsWith('/')) {
      window.location.href = '/';
    }

    fetch('/api/auth/trade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, state })
    })
      .then((res) => {
        if (res.ok) {
          window.location.href = `${window.location.origin}${redirectTo}`;
        } else {
          failed = 'Trade Failed';
        }
      })
      .catch(() => {
        failed = 'Trade Failed';
      });
  });
</script>

<div class="flex h-full flex-col items-center justify-center p-4">
  <Row class="flex h-full max-h-156 w-full max-w-lg flex-col items-center gap-4 overflow-hidden p-4">
    <div class="flex items-center justify-center gap-2">
      <img src={logo} alt="Titanium" class="h-12 w-12 rounded-md" translate="no" />
      <h1 class="text-2xl font-bold" translate="no">Titanium</h1>
    </div>

    <div class="my-auto flex h-full w-full items-center justify-center gap-2" class:flex-col={failed}>
      {#if failed}
        <div class="flex gap-2">
          <X size={28} class="text-red-400" />
          <p class="text-xl font-semibold">Login failed. Please try again.</p>
        </div>
      {:else}
        <LoaderCircle size={28} class="animate-spin" />
        <p class="text-xl font-semibold">Logging in...</p>
      {/if}
    </div>

    {#if failed}
      <div>
        <p class="text-center font-mono text-sm text-zinc-400">{failed}</p>
        <LogIn class="mt-2" />
      </div>
    {/if}
  </Row>
</div>
