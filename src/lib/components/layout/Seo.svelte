<script>
  import { noIndex, siteUrl } from "$lib/site.js";

  /* The one place a page's head is assembled: canonical, robots, Open Graph,
     Twitter card and keywords, from the same props on every route. */
  let {
    title,
    description,
    path = "/",
    image = undefined,
    alt = undefined,
    type = "website",
    keywords = [],
    noIndex: pageNoIndex = false,
    publishedTime = undefined,
    modifiedTime = undefined,
  } = $props();

  const base = siteUrl();

  let url = $derived(`${base}${path}`);
  let ogImage = $derived(image || `${base}/og-default.png`);
  /* Site-wide noindex while PUBLIC_ALLOW_INDEXING is off; individual pages
     (a missing post, say) can still opt out on their own. */
  let blocked = $derived(pageNoIndex || noIndex());
  let keywordList = $derived(keywords.filter(Boolean).join(", "));
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if keywordList}
    <meta name="keywords" content={keywordList} />
  {/if}
  <link rel="canonical" href={url} />
  <meta name="robots" content={blocked ? "noindex, nofollow" : "index, follow"} />

  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:type" content={type} />
  <meta property="og:site_name" content="ContioReach" />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:alt" content={alt || title} />
  {#if publishedTime}
    <meta property="article:published_time" content={publishedTime} />
  {/if}
  {#if modifiedTime}
    <meta property="article:modified_time" content={modifiedTime} />
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>
