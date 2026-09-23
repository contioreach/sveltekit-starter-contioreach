import { POSTS_PER_PAGE } from "$lib/constants.js";
import { loadListing } from "$lib/server/cms.js";

export async function load({ url }) {
  const currentPage = Math.max(1, Number.parseInt(url.searchParams.get("page"), 10) || 1);

  const listing = await loadListing({ page: currentPage, limit: POSTS_PER_PAGE });
  return { ...listing, currentPage };
}
