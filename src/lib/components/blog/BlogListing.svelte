<script>
  import BlogCard from "./BlogCard.svelte";

  /* Grid of posts. On page 1 of a listing the first post runs full width as a
     featured card; deeper pages are a plain uniform grid so the "featured"
     treatment keeps meaning something. */
  let { posts = [], featureFirst = true } = $props();

  let featured = $derived(featureFirst ? posts[0] : null);
  let grid = $derived(featured ? posts.slice(1) : posts);
</script>

{#if posts.length === 0}
  <div
    class="mx-auto max-w-lg rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-16 text-center"
  >
    <p class="text-lg font-medium text-white">Nothing here yet</p>
    <p class="mt-2 text-sm text-zinc-400">
      New articles land regularly — check back shortly, or browse another category.
    </p>
  </div>
{:else}
  <div class="space-y-8">
    {#if featured}
      <BlogCard post={featured} featured priority />
    {/if}

    {#if grid.length > 0}
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each grid as post, index (post.id || post.slug)}
          <BlogCard {post} priority={!featured && index < 3} />
        {/each}
      </div>
    {/if}
  </div>
{/if}
