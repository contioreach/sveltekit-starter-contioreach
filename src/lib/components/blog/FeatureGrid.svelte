<script>
  /* What this example actually demonstrates — the reason a developer landed
     here from a search result. Each item points at the file that implements it. */
  const features = [
    {
      title: "Cached reads with real tags",
      body: "SvelteKit ships no data cache, so this one is written out in full: TTL, stale-while-revalidate, single-flight refresh, and tag invalidation in about sixty lines.",
      file: "src/lib/server/cache.js",
    },
    {
      title: "On-demand revalidation",
      body: "A signed webhook from the CMS drops exactly the entries carrying a tag, so a published post goes live immediately without a redeploy.",
      file: "src/routes/api/revalidate/all/+server.js",
    },
    {
      title: "Server-only by construction",
      body: "The CMS client lives under src/lib/server, which SvelteKit refuses to import from client code. The API key cannot leak by accident.",
      file: "src/lib/server/cms.js",
    },
    {
      title: "Server-rendered article body",
      body: "CMS HTML gets stable heading anchors and a table of contents in one pass in the load function, instead of being parsed again in the browser.",
      file: "src/lib/content.js",
    },
    {
      title: "Pagination and archives",
      body: "A real ?page=N listing plus category archives, each a load function that reruns when the URL changes and nothing else.",
      file: "src/routes/blog/category/[slug]/+page.server.js",
    },
    {
      title: "SEO, done properly",
      body: "Canonicals, Open Graph, BlogPosting and BreadcrumbList JSON-LD, a generated sitemap, and a single switch that gates indexing.",
      file: "src/lib/components/layout/Seo.svelte",
    },
  ];
</script>

<section class="mx-auto max-w-7xl px-6 py-16 sm:py-20">
  <h2 class="text-3xl font-semibold text-white sm:text-4xl">What this example demonstrates</h2>
  <p class="mt-2 max-w-2xl text-zinc-400">
    The parts most headless CMS tutorials leave out — and where to find each one in the repo.
  </p>

  <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {#each features as feature (feature.title)}
      <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20">
        <h3 class="font-semibold text-white">{feature.title}</h3>
        <p class="mt-2.5 text-sm leading-relaxed text-zinc-400">{feature.body}</p>
        <code class="mt-4 block font-mono text-xs break-all text-cyan-300/80">{feature.file}</code>
      </div>
    {/each}
  </div>
</section>
