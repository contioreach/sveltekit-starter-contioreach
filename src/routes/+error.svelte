<script>
  import { page } from "$app/state";
  import Aurora from "$lib/components/blog/Aurora.svelte";
  import Seo from "$lib/components/layout/Seo.svelte";

  let notFound = $derived(page.status === 404);
</script>

<!-- An error page should never be indexed, whatever the site-wide switch says. -->
<Seo
  title={notFound ? "Page not found | ContioReach" : "Something went wrong | ContioReach"}
  description="The page you were looking for could not be found."
  path="/404"
  noIndex
/>

<div class="relative flex items-center overflow-hidden">
  <Aurora />
  <div class="relative mx-auto max-w-xl px-6 py-32 text-center">
    <p class="font-mono text-sm text-zinc-500">{page.status}</p>
    <h1 class="mt-4 text-4xl font-semibold text-balance text-white sm:text-5xl">
      {notFound ? "We couldn't find that page" : "Something went wrong"}
    </h1>
    <p class="mx-auto mt-5 max-w-md leading-relaxed text-pretty text-zinc-400">
      {notFound
        ? "The article may have been moved or unpublished. The blog index is a good place to pick up again."
        : "The page failed to render. Try again in a moment."}
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a
        href="/blog"
        class="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
      >
        Browse the blog
      </a>
      <a
        href="/"
        class="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/50"
      >
        Back home
      </a>
    </div>
  </div>
</div>
