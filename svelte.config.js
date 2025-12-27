import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    csp: {
      directives: {
        'script-src': ['self'],
        'frame-ancestors': ['self'],
        'upgrade-insecure-requests': true
      }
    }
  }
};

export default config;
