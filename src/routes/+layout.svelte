<script>
  import DemoBanner from "$lib/components/layout/DemoBanner.svelte";
  import SiteFooter from "$lib/components/layout/SiteFooter.svelte";
  import SiteHeader from "$lib/components/layout/SiteHeader.svelte";
  import "../app.css";

  let { children, data } = $props();
</script>

<DemoBanner status={data.keyStatus} />
<SiteHeader />
<main class="flex-1">
  {@render children()}
</main>
<SiteFooter />
