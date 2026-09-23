import { siteUrl } from "$lib/site.js";

export function breadcrumbSchema(crumbs) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${base}${crumb.path}`,
    })),
  };
}

export function blogPostingSchema(post) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${base}/blog/${post.slug}` },
    author: (post.authors?.length ? post.authors : [{ name: "ContioReach" }]).map((author) => ({
      "@type": "Person",
      name: author.name,
      url: author.website || undefined,
    })),
    publisher: {
      "@type": "Organization",
      name: "ContioReach",
      url: base,
    },
    keywords:
      [post.primaryKeyword, ...(post.tags?.map((tag) => tag.name) || [])]
        .filter(Boolean)
        .join(", ") || undefined,
  };
}
