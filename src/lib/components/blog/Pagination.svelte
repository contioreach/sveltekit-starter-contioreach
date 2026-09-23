<script>
  let { meta, basePath = "/blog" } = $props();

  /* Builds the window of page numbers around the current page, with `null`
     standing in for an ellipsis. */
  function pageWindow(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = new Set([1, total, current, current - 1, current + 1]);
    if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
    if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p));

    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

    const out = [];
    let previous = 0;
    for (const page of sorted) {
      if (previous && page - previous > 1) out.push(null);
      out.push(page);
      previous = page;
    }
    return out;
  }

  let total = $derived(meta?.totalPages || 0);
  let current = $derived(meta?.page || 1);
  let pages = $derived(pageWindow(current, total));

  const href = (page) => (page === 1 ? basePath : `${basePath}?page=${page}`);

  const arrow =
    "inline-flex h-10 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-4 text-sm font-medium text-zinc-300 transition hover:border-white/30 hover:text-white";
</script>

{#if total > 1}
  <nav aria-label="Pagination" class="flex flex-wrap items-center justify-center gap-2">
    {#if meta.hasPrevPage}
      <a href={href(current - 1)} rel="prev" class={arrow}>← Previous</a>
    {:else}
      <span class="{arrow} cursor-not-allowed opacity-40">← Previous</span>
    {/if}

    <ul class="flex items-center gap-1.5">
      {#each pages as page, index (page === null ? `gap-${index}` : page)}
        {#if page === null}
          <li class="px-1 text-zinc-600">…</li>
        {:else}
          <li>
            <a
              href={href(page)}
              aria-current={page === current ? "page" : undefined}
              class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition {page ===
              current
                ? 'bg-white text-zinc-950'
                : 'border border-white/12 bg-white/[0.04] text-zinc-300 hover:border-white/30 hover:text-white'}"
            >
              {page}
            </a>
          </li>
        {/if}
      {/each}
    </ul>

    {#if meta.hasNextPage}
      <a href={href(current + 1)} rel="next" class={arrow}>Next →</a>
    {:else}
      <span class="{arrow} cursor-not-allowed opacity-40">Next →</span>
    {/if}
  </nav>
{/if}
