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

  let name = $derived(data.category.name);
  let lower = $derived(name.toLowerCase());
  let description = $derived(
    data.category.description ||
      `Expert insights, strategies, and guides on ${lower}. Browse every ${lower} article on the ContioReach blog.`,
  );
</script>

<Seo
  title="{name} Articles | ContioReach Blog"
  {description}
  path="/blog/category/{data.slug}"
  alt="{name} articles on the ContioReach blog"
  keywords={[lower, data.slug, "headless cms", "content marketing", "blog"]}
/>

<!-- Built from the loaded category so the crumb uses its display name. -->
<JsonLd
  data={breadcrumbSchema([
    { name: "Blog", path: "/blog" },
    { name, path: `/blog/category/${data.slug}` },
  ])}
/>

<BlogHero
  eyebrow={name}
  paragraph={data.category.description ||
    `Expert insights, strategies, and guides on ${lower}, plus what we're learning building ContioReach.`}
  stat={data.meta?.total ? `${data.meta.total} articles in this category` : null}
>
  {#snippet heading()}
    Everything on
    <span
      class="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent"
    >
      {name}
    </span>
  {/snippet}
</BlogHero>

<div class="mx-auto max-w-7xl space-y-12 px-6 py-14">
  <CategoryPills categories={data.categories} active={data.slug} />
  <BlogListing posts={data.posts} featureFirst={data.currentPage === 1} />
  <Pagination meta={data.meta} basePath="/blog/category/{data.slug}" />
</div>

<CTASection />
