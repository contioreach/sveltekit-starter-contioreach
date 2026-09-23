import { getAllBlogSlugs, getAllCategorySlugs } from "$lib/server/cms.js";
import { siteUrl } from "$lib/site.js";

function entry(loc, lastmod, priority) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
}

export async function GET() {
  const base = siteUrl();
  const [posts, categories] = await Promise.all([getAllBlogSlugs(), getAllCategorySlugs()]);
  const now = new Date().toISOString();

  const urls = [
    entry(`${base}/`, now, 1),
    entry(`${base}/blog`, now, 0.9),
    ...categories.map((c) => entry(`${base}/blog/category/${c.slug}`, now, 0.7)),
    ...posts.map((p) => entry(`${base}/blog/${p.slug}`, now, 0.8)),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
