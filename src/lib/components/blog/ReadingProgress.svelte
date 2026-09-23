<script>
  /* Thin gradient bar pinned to the top of the article page. */
  let progress = $state(0);

  $effect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  });
</script>

<div aria-hidden="true" class="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
  <div
    class="h-full origin-left bg-gradient-to-r from-fuchsia-500 via-violet-400 to-cyan-400 transition-transform duration-150"
    style="transform: scaleX({progress})"
  ></div>
</div>
