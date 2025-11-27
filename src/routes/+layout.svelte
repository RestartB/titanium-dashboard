<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import Header from '$lib/components/Header.svelte';

  import { onNavigate } from '$app/navigation';

  let { children, data } = $props();

  // Define page hierarchy with depth levels
  const pageHierarchy: Record<string, { depth: number; order: number }> = {
    home: { depth: 0, order: 0 },
    general: { depth: 0, order: 1 },
    permissions: { depth: 0, order: 2 },
    errors: { depth: 0, order: 3 },
    moderation: { depth: 0, order: 4 },
    'moderation/cases': { depth: 1, order: 0 },
    automod: { depth: 0, order: 5 },
    bouncer: { depth: 0, order: 6 },
    logging: { depth: 0, order: 7 },
    fireboard: { depth: 0, order: 8 },
    leaderboard: { depth: 0, order: 9 },
    server_counters: { depth: 0, order: 10 },
    confessions: { depth: 0, order: 11 }
  };

  function getPageInfo(url: URL, params: Record<string, string | undefined> | null) {
    if (!params || !params.guildid) return null;

    const guildPath = `/guild/${params.guildid}/`;
    const afterGuild = url.pathname.replace(guildPath, '');

    const pagePath = afterGuild || 'home';

    if (pagePath === `/guild/${params.guildid}`) {
      return pageHierarchy['home'] || null;
    } else {
      return pageHierarchy[pagePath] || null;
    }
  }

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    if (!navigation.to || !navigation.from) return;
    if (navigation.to.url.href === navigation.from.url.href) return;

    const fromPage = getPageInfo(navigation.from.url, navigation.from.params);
    const toPage = getPageInfo(navigation.to.url, navigation.to.params);

    // fade if this is a non guild page
    if (!fromPage || !toPage) {
      document.documentElement.style.setProperty('--old-animation', 'fade-out');
      document.documentElement.style.setProperty('--new-animation', 'fade-in');
      return new Promise((resolve) => {
        document.startViewTransition(async () => {
          resolve();
          await navigation.complete;
        });
      });
    }

    let oldAnim = 'fade-out';
    let newAnim = 'fade-in';

    // compare depths
    if (toPage.depth > fromPage.depth) {
      // going into a subpage
      oldAnim = 'slide-to-left';
      newAnim = 'slide-from-right';
    } else if (toPage.depth < fromPage.depth) {
      // coming out
      oldAnim = 'slide-to-right';
      newAnim = 'slide-from-left';
    } else if (toPage.depth === fromPage.depth) {
      // same depth
      const isForward = toPage.order > fromPage.order;
      oldAnim = isForward ? 'slide-to-top' : 'slide-to-bottom';
      newAnim = isForward ? 'slide-from-bottom' : 'slide-from-top';
    }

    document.documentElement.style.setProperty('--old-animation', oldAnim);
    document.documentElement.style.setProperty('--new-animation', newAnim);

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  <title>Titanium Dashboard</title>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen flex-col">
  <Header userData={data.userData} />
  <div class="flex-1 overflow-hidden pt-12">
    {@render children?.()}
  </div>
</div>

<style>
  :root::view-transition-old(root) {
    animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both var(--old-animation);
  }

  :root::view-transition-new(root) {
    animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both var(--new-animation);
  }
</style>
