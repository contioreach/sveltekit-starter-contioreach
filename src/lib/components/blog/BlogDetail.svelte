<script>
  import { formatDate, initials, readingTimeFor } from "$lib/format.js";
  import { siteUrl } from "$lib/site.js";
  import Aurora from "./Aurora.svelte";
  import AuthorCard from "./AuthorCard.svelte";
  import BlogCard from "./BlogCard.svelte";
  import MetaCell from "./MetaCell.svelte";
  import RailCta from "./RailCta.svelte";
  import ReadingProgress from "./ReadingProgress.svelte";
  import ShareBar from "./ShareBar.svelte";
  import TableOfContents from "./TableOfContents.svelte";

  /* The body arrives already prepared — anchored HTML plus the TOC — from the
     page's load function, so nothing here re-parses it. */
  let { post, relatedBlogs = [] } = $props();

  let author = $derived(post.author);
  let published = $derived(formatDate(post.publishedAt, { month: "long" }));

  /* Only shown when it differs from the publish date — "Updated" repeating the
     same day reads as a bug. */
  let updated = $derived(
    post.updatedAt && post.updatedAt.slice(0, 10) !== (post.publishedAt || "").slice(0, 10)
      ? formatDate(post.updatedAt, { month: "long" })
      : null,
  );

  let reading = $derived(readingTimeFor(post));
  let url = $derived(`${siteUrl()}/blog/${post.slug}`);
</script>

<article>
  <ReadingProgress />

  <header class="relative overflow-hidden border-b border-white/10">
    <Aurora />
    <div class="relative mx-auto max-w-4xl px-6 pt-14 pb-12 sm:pt-20">
      <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <a href="/blog" class="transition hover:text-white">Blog</a>
        {#if post.categorySlug}
          <span aria-hidden="true">/</span>
          <a href="/blog/category/{post.categorySlug}" class="transition hover:text-white">
            {post.category}
          </a>
        {/if}
      </nav>

      <h1 class="mt-5 text-4xl leading-[1.08] font-semibold text-balance text-white sm:text-5xl">
        {post.title}
      </h1>

      {#if post.excerpt || post.description}
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-zinc-400">
          {post.excerpt || post.description}
        </p>
      {/if}

      <div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-white/10 pt-6">
        {#if author}
          <div class="flex items-center gap-3">
            {#if author.image}
              <img
                src={author.image}
                alt={author.name || ""}
                width="40"
                height="40"
                decoding="async"
                class="h-10 w-10 rounded-full object-cover ring-1 ring-white/15"
              />
            {:else}
              <span
                class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-zinc-200"
              >
                {initials(author.name)}
              </span>
            {/if}
            <MetaCell label="Author" value={author.name} />
          </div>
        {/if}
        {#if published}<MetaCell label="Published" value={published} />{/if}
        {#if updated}<MetaCell label="Updated" value={updated} />{/if}
        {#if reading}<MetaCell label="Read time" value={reading} />{/if}
        <div class="sm:ml-auto">
          <ShareBar {url} title={post.title} />
        </div>
      </div>
    </div>
  </header>

  {#if post.coverImage}
    <div class="mx-auto max-w-5xl px-6">
      <div class="relative aspect-[16/8] overflow-hidden rounded-3xl border border-white/10 sm:-mt-10">
        <img
          src={post.coverImage}
          alt={post.title}
          fetchpriority="high"
          decoding="async"
          class="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  {/if}

  <div class="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_20rem]">
    <!-- Body HTML comes from our own CMS. -->
    <div class="blog-content">{@html post.html || "<p>No content available.</p>"}</div>

    <aside class="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <TableOfContents items={post.toc || []} />
      <AuthorCard {author} />
      <RailCta slug={post.slug} />
    </aside>
  </div>

  {#if post.tags?.length}
    <div class="mx-auto max-w-7xl px-6 pb-8">
      <div class="flex flex-wrap gap-2">
        {#each post.tags as tag (tag.id || tag.slug || tag.name)}
          <span class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
            #{tag.name}
          </span>
        {/each}
      </div>
    </div>
  {/if}

  {#if relatedBlogs.length}
    <section class="border-t border-white/10">
      <div class="mx-auto max-w-7xl px-6 py-16">
        <div class="mb-8 flex items-end justify-between gap-4">
          <h2 class="text-2xl font-semibold text-white sm:text-3xl">Keep reading</h2>
          <a href="/blog" class="text-sm text-zinc-400 transition hover:text-white">All articles →</a>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each relatedBlogs as related (related.id || related.slug)}
            <BlogCard post={related} />
          {/each}
        </div>
      </div>
    </section>
  {/if}
</article>
