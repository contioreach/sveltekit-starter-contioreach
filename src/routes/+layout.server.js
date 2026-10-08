import { getApiKeyStatus } from "$lib/server/cms.js";

/* Rendered on demand: the pages read from the CMS and the cache in
   src/lib/server/cache.js is what keeps that cheap. Set this to true on a
   route to prerender it instead. */
export const prerender = false;

/* The demo banner's only input: a status, never the key. See getApiKeyStatus
   in src/lib/server/cms.js. */
export async function load() {
  return { keyStatus: await getApiKeyStatus() };
}
