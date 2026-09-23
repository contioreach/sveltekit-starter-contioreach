<script>
  let { data } = $props();

  /* Structured data we generate ourselves, so the JSON is safe to inline. The
     closing tag is split so it cannot terminate the surrounding script block. */
  let json = $derived(data ? JSON.stringify(data) : null);
</script>

<svelte:head>
  {#if json}
    {@html `<script type="application/ld+json">${json}<\/script>`}
  {/if}
</svelte:head>
