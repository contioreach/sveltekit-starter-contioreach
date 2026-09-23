# SvelteKit Headless CMS Starter

A complete, production-shaped blog built with **SvelteKit 2 and Svelte 5** and a **headless CMS**, using [ContioReach](https://contioreach.com) as the content backend.

Not a toy. It ships the things a real content site actually needs and most examples skip: cached CMS reads with stale-while-revalidate and real tag invalidation, an on-demand revalidation webhook, category archives, pagination, a table of contents generated from the article body, full SEO metadata, JSON-LD, and a sitemap.

```bash
npx degit contioreach/sveltekit-starter-contioreach my-blog
cd my-blog && npm install
cp .env.example .env   # add your API key
npm run dev
```

> Looking for another stack? See the [Next.js](https://github.com/contioreach/nextjs-starter-contioreach), [Nuxt](https://github.com/contioreach/nuxtjs-starter-contioreach), [Astro](https://github.com/contioreach/astro-starter-contioreach), [Remix](https://github.com/contioreach/remix-starter-contioreach) and [React](https://github.com/contioreach/react-starter-contioreach) examples.

---

## What's in the box

| Feature | Where |
| --- | --- |
| Blog index with pagination | [`src/routes/blog/+page.server.js`](src/routes/blog/+page.server.js) |
| Article page | [`src/routes/blog/[slug]/+page.server.js`](src/routes/blog/%5Bslug%5D/+page.server.js) |
| Category archives | [`src/routes/blog/category/[slug]/+page.server.js`](src/routes/blog/category/%5Bslug%5D/+page.server.js) |
| CMS client and transforms | [`src/lib/server/cms.js`](src/lib/server/cms.js) |
| Cache: TTL, SWR, single-flight, tags | [`src/lib/server/cache.js`](src/lib/server/cache.js) |
| …and its tests | [`src/lib/server/cache.test.js`](src/lib/server/cache.test.js) |
| On-demand revalidation webhook | [`src/routes/api/revalidate/all/+server.js`](src/routes/api/revalidate/all/+server.js) |
| Table of contents + stable heading anchors | [`src/lib/content.js`](src/lib/content.js) |
| Metadata, Open Graph, JSON-LD | [`src/lib/components/layout/Seo.svelte`](src/lib/components/layout/Seo.svelte), [`src/lib/schema.js`](src/lib/schema.js) |
| Sitemap and robots | [`src/routes/sitemap.xml/+server.js`](src/routes/sitemap.xml/+server.js), [`src/routes/robots.txt/+server.js`](src/routes/robots.txt/+server.js) |
| Article typography (raw CMS HTML) | [`src/app.css`](src/app.css) |

Styling is Tailwind CSS v4. No UI library, no MDX pipeline, no database — the CMS is the only backend. The only runtime dependencies are SvelteKit and its adapter.

---

## 1. Environment variables

Copy the template and fill it in:

```bash
cp .env.example .env
```

```env
CMS_API_URL=https://cms-api.contioreach.com
CMS_API_KEY=cms_xxxxxxxxxxxxxxxxxxxxxxxx
REVALIDATION_SECRET=revalidate_xxxxxxxxxxxx
PUBLIC_SITE_URL=http://localhost:5173
PUBLIC_ALLOW_INDEXING=false
PUBLIC_SIGNUP_URL=https://app.contioreach.com/signup
PUBLIC_LOGIN_URL=https://app.contioreach.com/login
```

Get `CMS_API_KEY` and `REVALIDATION_SECRET` from your ContioReach workspace settings (the free plan is enough).

Each variable is read in exactly one place — [`src/lib/server/config.js`](src/lib/server/config.js) for the three secrets, [`src/lib/site.js`](src/lib/site.js) for the four public ones — and both throw a named error when one is missing.

They are read through `$env/dynamic/*` rather than `$env/static/*`, so the built server picks values up from its real environment at boot. That is what a container or a PaaS actually provides, and it means one build artifact runs in staging and production. Running the built server locally:

```bash
npm run build
node --env-file=.env build/index.js
```

**The API key cannot leak by construction.** [`src/lib/server/cms.js`](src/lib/server/cms.js) lives under `src/lib/server/`, and SvelteKit fails the build if client-side code ever imports it — you get an error at build time, not a secret in a bundle.

---

## 2. Fetching content

Load functions in `+page.server.js` call the CMS client and hand plain data to the components. That code only ever runs on the server, including on client-side navigations, where SvelteKit fetches the serialized `data` for the next route instead.

Components never see the API's shape: a transform layer maps it first, so swapping in Contentful, Sanity or Strapi is `apiRequest` plus two `transform*` functions, without touching a component.

The article body is prepared in the load function ([`src/lib/content.js`](src/lib/content.js)): heading anchors added, and the table of contents built from that same pass so the two cannot drift. The raw body is dropped from the payload afterwards, since shipping both would double it.

---

## 3. Caching and revalidation

This is the one place SvelteKit gives you less than the other three stacks in this set. Next has `revalidateTag`, Astro has a tagged response cache, Nitro has cached function groups. SvelteKit has no data cache at all — so [`src/lib/server/cache.js`](src/lib/server/cache.js) writes one out, in about sixty lines:

- a value is **fresh** for `maxAge` seconds;
- after that it is served **stale** for up to `swr` seconds while one refresh runs behind the request, so no visitor waits on the CMS;
- concurrent misses on a cold key **share a single load**, so a burst doesn't stampede the CMS;
- a **failing background refresh keeps the stale value**, so a CMS blip doesn't take the page down;
- every entry carries **tags**, and `invalidate(tags)` drops exactly the entries that match.

Because it is hand-written rather than handed to you, those semantics are pinned by tests — [`cache.test.js`](src/lib/server/cache.test.js), seven of them, run with `npm test`. No test runner to install; it's `node:test`.

**The webhook.** `POST /api/revalidate/all` is what your CMS calls on publish. It checks the shared secret, then drops every entry carrying one of the tags:

```bash
curl -X POST https://your-site.com/api/revalidate/all \
  -H 'content-type: application/json' \
  -d '{"secret":"revalidate_xxx","post":{"slug":"my-post"}}'
```

Naming a post adds its `blog-<slug>` tag to the purge, so a single article can be invalidated without dropping every listing. The response reports how many entries went. The secret is accepted in the body or as an `X-API-Key` header; anything else gets a 401.

**Before you scale out:** the cache is per-process and in-memory. A webhook that lands on one instance only invalidates that instance. That is fine for a single server and for the CDN-fronted deployments most people run, but with several instances you want either a shared store behind the same `cached()` interface (Redis, say — the module is small and deliberately easy to swap) or a CDN purge on the same webhook.

---

## 4. SEO

- Canonical, Open Graph, Twitter card, robots and keywords come from one component, [`Seo.svelte`](src/lib/components/layout/Seo.svelte), given the same props on every route.
- `BlogPosting` and `BreadcrumbList` JSON-LD from [`src/lib/schema.js`](src/lib/schema.js).
- `/sitemap.xml` is generated from the CMS on request; `/robots.txt` follows the same switch as the meta tags.
- Posts fall back to `/og-default.png` when they have no cover image — drop your own into `static/` before launch.
- **Indexing is off by default.** Until `PUBLIC_ALLOW_INDEXING` is exactly `"true"`, every page ships `noindex, nofollow` and `robots.txt` disallows everything — so a demo deployment can't compete with your posts' canonical home.

---

## 5. Project structure

```
src/
  lib/
    components/blog/    Cards, listing, hero, TOC, share bar, article detail
    components/layout/  Header, footer, SEO head, JSON-LD
    server/             CMS client, config and the cache — server-only by
                        construction: SvelteKit refuses to import these from
                        client code
    content.js          Article body prep — anchors + table of contents
    format.js           Dates, initials, reading time
    schema.js           JSON-LD builders
    site.js             The four public env values
    constants.js        Values that don't vary by environment
  routes/               /, /blog, /blog/[slug], /blog/category/[slug],
                        sitemap.xml, robots.txt, the webhook, +error
  app.css               Tailwind entry + article typography for raw CMS HTML
  app.html              The HTML shell
```

---

## 6. Deploying

`npm run build` produces a Node server in `build/`; `node build/index.js` runs it. Swap `@sveltejs/adapter-node` for the Vercel, Netlify or Cloudflare adapter and nothing else changes — see [SvelteKit adapters](https://svelte.dev/docs/kit/adapters). Set the same environment variables there, with `PUBLIC_SITE_URL` pointing at your real domain, and point the CMS publish webhook at `https://your-domain/api/revalidate/all`.

On a serverless adapter, note that the in-memory cache lives only as long as a warm instance. There, lean on the CDN in front of it and treat the webhook as a CDN purge trigger.

---

## License

MIT — see [LICENSE](LICENSE). Clone it, strip it back, rebrand it, ship it.
