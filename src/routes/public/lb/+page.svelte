<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import logo from '$lib/assets/logo.png';
</script>

{#snippet lbRow(
  username: string,
  display: string,
  pfp: string,
  id: string,
  position: string,
  xp: string,
  level: string,
  change: string
)}
  <div class="flex w-full items-center gap-2" {id}>
    <p class="font-bold">{position}</p>
    <img src={pfp} alt="Logo" class="h-10 w-10 shrink-0 rounded-full" />
    <div class="flex-1">
      <p class="text-sm font-light">@{username}</p>
      <p>{display}</p>
    </div>

    <p class="ml-auto max-w-12.5 min-w-12.5 overflow-hidden text-center font-bold text-ellipsis">{change}</p>
    <p class="max-w-12.5 min-w-12.5 overflow-hidden text-center font-bold text-ellipsis">{xp}</p>
    <p class="max-w-12.5 min-w-12.5 overflow-hidden text-center font-bold text-ellipsis">{level}</p>
  </div>
{/snippet}

<div class="m-4 flex flex-col items-center gap-8">
  <h1 class="font-semibold">Server Leaderboard</h1>

  <Row class="-mt-4 flex items-center gap-2 px-6">
    <img src={logo} alt="Logo" class="h-8 w-8 rounded-md" />
    <p>Guild Name</p>
  </Row>

  <div class="flex w-full justify-center gap-20">
    <div class="text-center">
      <h3 class="mb-2 text-3xl font-semibold">2nd</h3>
      <img
        src={logo}
        alt="Logo"
        class="h-30 w-30 shrink-0 rounded-full border-4 border-zinc-400 shadow-[0_0_30px_rgba(192,192,192,1)]"
      />
      <p class="mt-2 text-xl font-semibold">@restartb</p>
      <p class="text-zinc-400">3,021xp - level 5</p>
    </div>

    <div class="text-center">
      <h3 class="mb-2 text-5xl font-bold">1st</h3>
      <img
        src={logo}
        alt="Logo"
        class="h-40 w-40 shrink-0 rounded-full border-4 border-zinc-400 shadow-[0_0_50px_rgba(255,215,0,1)]"
      />
      <p class="mt-2 text-xl font-semibold">@restartb</p>
      <p class="text-zinc-400">3,021xp - level 5</p>
    </div>

    <div class="text-center">
      <h3 class="mb-2 text-3xl font-semibold">3rd</h3>
      <img
        src={logo}
        alt="Logo"
        class="h-30 w-30 shrink-0 rounded-full border-4 border-zinc-400 shadow-[0_0_30px_rgba(205,127,50,1)]"
      />
      <p class="mt-2 text-xl font-semibold">@restartb</p>
      <p class="text-zinc-400">3,021xp - level 5</p>
    </div>
  </div>

  <Row class="w-full max-w-3xl space-y-2">
    <div class="flex items-center justify-end gap-2">
      <p class="max-w-12.5 min-w-12.5 overflow-hidden text-center text-base text-ellipsis">+ -</p>
      <p class="max-w-12.5 min-w-12.5 overflow-hidden text-center text-base text-ellipsis">XP</p>
      <p class="max-w-12.5 min-w-12.5 overflow-hidden text-center text-base text-ellipsis">Level</p>
    </div>

    {@render lbRow('restartb', 'restart', logo, '1', '4th', '500', '5', '+5')}
    {@render lbRow('restartb', 'restart', logo, '1', '4th', '500', '5', '+5')}
    {@render lbRow('restartb', 'restart', logo, '1', '4th', '500', '5', '+5')}
    {@render lbRow('restartb', 'restart', logo, '1', '4th', '500', '5', '+5')}
    {@render lbRow('restartb', 'restart', logo, '1', '4th', '500', '5', '+5')}
  </Row>
</div>
