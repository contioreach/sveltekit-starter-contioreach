<script>
  import BlogHero from "$lib/components/blog/BlogHero.svelte";
  import BlogListing from "$lib/components/blog/BlogListing.svelte";
  import CategoryPills from "$lib/components/blog/CategoryPills.svelte";
  import CTASection from "$lib/components/blog/CTASection.svelte";
  import Pagination from "$lib/components/blog/Pagination.svelte";
  import JsonLd from "$lib/components/layout/JsonLd.svelte";
  import Seo from "$lib/components/layout/Seo.svelte";
  import { breadcrumbSchema } from "$lib/schema.js";

  let { data } = $props();
</script>

<Seo
  title="Blog | Headless CMS, SEO & Content Strategy | ContioReach"
  description="Practical guides on headless CMS, SEO, AI search, blogging, and the workflows behind content that gets discovered, read, and cited."
  path="/blog"
  alt="The ContioReach blog"
  keywords={[
    "headless cms blog",
    "content marketing",
    "seo tips",
    "ai search optimization",
    "blogging workflow",
    "content strategy",
  ]}
/>
<JsonLd data={breadcrumbSchema([{ name: "Blog", path: "/blog" }])} />

<BlogHero
  paragraph="Headless CMS, SEO, AI search, and the workflows behind content that gets discovered, read, and cited."
  stat={data.meta?.total ? `${data.meta.total} articles and counting` : null}
>
  {#snippet heading()}
    Writing about the craft of
    <span
      class="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent"
    >
      publishing well
    </span>
  {/snippet}
</BlogHero>

<div class="mx-auto max-w-7xl space-y-12 px-6 py-14">
  <CategoryPills categories={data.categories} />
  <BlogListing posts={data.posts} featureFirst={data.currentPage === 1} />
  <Pagination meta={data.meta} basePath="/blog" />
</div>

<CTASection />
