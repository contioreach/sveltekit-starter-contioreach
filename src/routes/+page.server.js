import { loadListing } from "$lib/server/cms.js";

export async function load() {
  // Seven newest posts: one featured card plus two rows.
  return loadListing({ page: 1, limit: 7 });
}
