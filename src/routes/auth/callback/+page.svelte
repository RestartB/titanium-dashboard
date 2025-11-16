<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import logo from '$lib/assets/logo.svg';
  import { LoaderCircle } from '@lucide/svelte';
  import { onMount } from 'svelte';

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(';').shift() || '');
    }
    return null;
  };

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      // window.location.href = '/';
      alert('No code parameter found. Please try logging in again.');
      return;
    }

    const state = params.get('state');
    const stateCookie = getCookie('titanium_state');

    if (!state || !stateCookie || state !== stateCookie) {
      // window.location.href = '/';
      alert('Invalid state parameter. Please try logging in again.');
      return;
    }

    // get redirect from state
    const stateParts = state.split('-');
    const redirectPart = stateParts.slice(2).join('-');
    const redirectTo = redirectPart ? decodeURIComponent(atob(redirectPart)) : '/';

    if (!redirectTo.startsWith('/')) {
      // window.location.href = '/';
      alert('Invalid redirect URL. Please try logging in again.');
      return;
    }

    fetch('/api/auth/trade', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    })
      .then((res) => {
        if (res.ok) {
          window.location.href = `${window.location.origin}${redirectTo}`;
        } else {
          // window.location.href = '/';
          alert('An error occurred. Please try logging in again.');
        }
      })
      .catch(() => {
        // window.location.href = '/';
        alert('An error occurred. Please try logging in again.');
      });
  });
</script>

<div class="flex h-full flex-col items-center justify-center p-4">
  <Row class="m-4 flex flex-col items-center justify-center gap-4 p-4">
    <div class="flex items-center justify-center gap-2">
      <img src={logo} alt="Titanium" class="h-12 w-12 rounded-md" translate="no" />
      <h1 class="text-2xl font-bold" translate="no">Titanium Dashboard</h1>
    </div>

    <LoaderCircle size={24} class="animate-spin" />
  </Row>
</div>
