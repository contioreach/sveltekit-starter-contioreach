import { error } from "@sveltejs/kit";
import { POSTS_PER_PAGE } from "$lib/constants.js";
import { getCategory, loadListing } from "$lib/server/cms.js";

export async function load({ params, url }) {
  const currentPage = Math.max(1, Number.parseInt(url.searchParams.get("page"), 10) || 1);

  const category = await getCategory(params.slug);
  if (!category) {
    error(404, "Category not found");
  }

  const listing = await loadListing({
    page: currentPage,
    limit: POSTS_PER_PAGE,
    category: params.slug,
  });

  return { ...listing, category, currentPage, slug: params.slug };
}
