<script>
  /* Sticky contents rail. The headings are parsed in the page's load function
     and handed in, so this only tracks which one is on screen. */
  let { items = [] } = $props();

  /* Empty until the observer reports one; the first heading stands in so the
     rail is never blank on load. */
  let observedId = $state("");
  let activeId = $derived(observedId || items[0]?.id || "");

  $effect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) observedId = entry.target.id;
        }
      },
      { rootMargin: "-20% 0% -35% 0%" },
    );

    for (const item of items) {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  });

  function scrollTo(event, id) {
    const element = document.getElementById(id);
    if (!element) return;
    event.preventDefault();
    // Offset so the heading clears the sticky page header.
    const top = element.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  }
</script>

{#if items.length > 0}
  <nav
    aria-label="Table of contents"
    class="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
  >
    <p class="mb-4 text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
      On this page
    </p>
    <ul class="max-h-[60vh] space-y-1 overflow-y-auto border-l border-white/10">
      {#each items as item (item.id)}
        <li>
          <a
            href="#{item.id}"
            onclick={(event) => scrollTo(event, item.id)}
            style="padding-left: {14 + (item.level - 2) * 12}px"
            class="-ml-px block border-l-2 py-1.5 pr-2 text-sm leading-snug transition {activeId ===
            item.id
              ? 'border-fuchsia-400 font-medium text-white'
              : 'border-transparent text-zinc-400 hover:border-white/30 hover:text-zinc-200'}"
          >
            {item.title}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}
