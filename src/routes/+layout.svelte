<script>
  import SiteFooter from "$lib/components/layout/SiteFooter.svelte";
  import SiteHeader from "$lib/components/layout/SiteHeader.svelte";
  import "../app.css";

  let { children } = $props();
</script>

<SiteHeader />
<main class="flex-1">
  {@render children()}
</main>
<SiteFooter />
