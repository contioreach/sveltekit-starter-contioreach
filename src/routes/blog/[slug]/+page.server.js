import { error } from "@sveltejs/kit";
import { prepareContent } from "$lib/content.js";
import { getPost, getRelated } from "$lib/server/cms.js";

export async function load({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    error(404, "Blog post not found");
  }

  /* One pass produces the anchored HTML and the table of contents together, so
     the two cannot drift — and it happens here, not in the component, so the
     browser never re-parses the article. */
  const { html, toc } = prepareContent(post.content);
  const related = await getRelated(post.categorySlug, post.id);

  // The raw body is dropped: the prepared html replaces it, and shipping both
  // would double the payload for no gain.
  const { content, ...rest } = post;

  return { post: { ...rest, html, toc }, related };
}
