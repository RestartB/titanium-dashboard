<script lang="ts">
  import { resolve } from '$app/paths';
  import discord from '$lib/assets/discord.svg';

  const { redirect = "", class: className = '' } = $props();
  if (redirect) {
    const authUrl = `/auth/login?redirect=${redirect}`;
  } else {
    const authUrl = "/auth/login"
  }
</script>

<a
  class="flex w-fit items-center justify-center gap-2 rounded-md bg-blurple p-2 px-4 text-white transition-all hover:brightness-150 {className}"
  href={resolve(authUrl)}
>
  <img src={discord} alt="Discord" class="h-6 w-6" />
  Log in with Discord
</a>
