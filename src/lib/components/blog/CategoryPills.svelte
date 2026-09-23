<script>
  /* Category nav for the listing pages. `active` is the current category slug,
     or null on /blog. */
  let { categories = [], active = null } = $props();

  let items = $derived([
    { name: "All posts", slug: null, href: "/blog" },
    ...categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      href: `/blog/category/${c.slug}`,
      count: c.postCount,
    })),
  ]);
</script>

{#if categories.length > 0}
  <nav aria-label="Blog categories" class="flex flex-wrap justify-center gap-2.5">
    {#each items as item (item.href)}
      <a
        href={item.href}
        aria-current={item.slug === active ? "page" : undefined}
        class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition {item.slug ===
        active
          ? 'border-transparent bg-white text-zinc-950 shadow-[0_0_30px_-8px_rgba(255,255,255,0.6)]'
          : 'border-white/12 bg-white/[0.04] text-zinc-300 hover:border-white/30 hover:text-white'}"
      >
        {item.name}
        {#if typeof item.count === "number"}
          <span class="text-zinc-500">{item.count}</span>
        {/if}
      </a>
    {/each}
  </nav>
{/if}
