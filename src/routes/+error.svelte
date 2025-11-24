<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
</script>

<div class="border-box flex h-screen w-full flex-col items-center justify-center gap-4 p-4">
  <div class="flex flex-col items-center justify-center">
    <img src="https://http.cat/{page.status}" alt="Cat image for error code {page.status}" class="mb-4 h-100 rounded-xl border-2 border-zinc-600" />
    <h1 class="text-center font-mono text-8xl font-bold">{page.status}</h1>
    <h2 class="text-center text-2xl">
      {page.error && page.error.message ? page.error.message : 'An error occurred'}
    </h2>
  </div>
  <a
    href={resolve('/')}
    class="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-zinc-600 bg-zinc-700 px-4 py-2 font-bold text-nowrap transition-colors hover:bg-zinc-600"
  >
    Go Home
  </a>
</div>
