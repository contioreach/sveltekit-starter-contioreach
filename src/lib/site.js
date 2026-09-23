import { env } from "$env/dynamic/public";

/* The public half of the configuration, safe in components. These four are the
   only environment values that reach the browser; the CMS key and the webhook
   secret stay in src/lib/server/config.js, which SvelteKit will refuse to
   import from client-side code. */
function required(name) {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. See .env.example.`);
  }
  return value;
}

export const siteUrl = () => required("PUBLIC_SITE_URL");
export const signupUrl = () => required("PUBLIC_SIGNUP_URL");
export const loginUrl = () => required("PUBLIC_LOGIN_URL");

/* Site-wide noindex. The site isn't ready to be indexed yet, so every page
   ships `noindex, nofollow` until PUBLIC_ALLOW_INDEXING is exactly "true".
   Flip that one env var to let search engines back in. */
export const noIndex = () => env.PUBLIC_ALLOW_INDEXING !== "true";
