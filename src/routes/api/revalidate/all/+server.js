import { json } from "@sveltejs/kit";
import { CACHE_TAGS } from "$lib/constants.js";
import { invalidate } from "$lib/server/cache.js";
import { revalidationSecret } from "$lib/server/config.js";

/* Publish webhook from ContioReach. Fired when a post is published, scheduled,
   deleted, or a published post is edited. Body: { secret, post }; the same
   secret is also accepted as the X-API-Key header.

   SvelteKit has no revalidateTag, so the tags come from the cache in
   src/lib/server/cache.js: every cached read carries them, and invalidate()
   drops exactly the entries that match. */
export async function POST({ request }) {
  try {
    const body = await request.json().catch(() => ({}));
    const secret = body?.secret || request.headers.get("x-api-key");

    if (secret !== revalidationSecret()) {
      return json({ error: "Invalid token" }, { status: 401 });
    }

    const tags = Object.values(CACHE_TAGS);

    /* When the webhook names a post, its own tag goes too — the listings are
       dropped by the shared tags either way. */
    if (body?.post?.slug) tags.push(`blog-${body.post.slug}`);

    const entries = invalidate(tags);

    console.log("Blog cache revalidated", {
      slug: body?.post?.slug ?? null,
      entries,
      timestamp: new Date().toISOString(),
    });

    return json({
      success: true,
      message: "All blog cache revalidated successfully",
      revalidated: { tags, entries },
    });
  } catch (error) {
    console.error("Full revalidation error:", error);
    return json(
      { success: false, error: "Failed to revalidate blog cache", details: error.message },
      { status: 500 },
    );
  }
}
