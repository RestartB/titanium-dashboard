<script lang="ts">
  import Row from '$lib/components/ui/row/Row.svelte';
  import logo from '$lib/assets/logo.png';
</script>

<div class="m-4 flex flex-col items-center gap-4">
  <h1 class="">Server Leaderboard</h1>

  <Row class="flex items-center gap-2 px-6">
    <img src={logo} alt="Logo" class="h-8 w-8 rounded-md" />
    <p>Guild Name</p>
  </Row>

  <div class="flex w-full justify-center gap-10">
    <div class="text-center">
      <h3 class="mb-2 text-3xl font-semibold">2nd</h3>
      <img
        src={logo}
        alt="Logo"
        class="h-30 w-30 rounded-full border-4 border-zinc-400 shadow-[0_0_30px_rgba(192,192,192,1)]"
      />
      <p class="mt-2 text-xl font-semibold">@restartb</p>
      <p class="text-zinc-400">3,021xp - level 5</p>
    </div>
    <div class="text-center">
      <h3 class="mb-2 text-5xl font-bold">1st</h3>
      <img
        src={logo}
        alt="Logo"
        class="h-40 w-40 rounded-full border-4 border-zinc-400 shadow-[0_0_50px_rgba(255,215,0,1)]"
      />
      <p class="mt-2 text-xl font-semibold">@restartb</p>
      <p class="text-zinc-400">3,021xp - level 5</p>
    </div>
    <div class="text-center">
      <h3 class="mb-2 text-3xl font-semibold">3rd</h3>
      <img
        src={logo}
        alt="Logo"
        class="h-30 w-30 rounded-full border-4 border-zinc-400 shadow-[0_0_30px_rgba(205,127,50,1)]"
      />
      <p class="mt-2 text-xl font-semibold">@restartb</p>
      <p class="text-zinc-400">3,021xp - level 5</p>
    </div>
  </div>
</div>
