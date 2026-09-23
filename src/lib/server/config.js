import { env } from "$env/dynamic/private";

/* Every server-side environment variable is read here and nowhere else. Read
   through $env/dynamic/private so the built server picks the values up from
   its real environment at boot — which is what a container or a PaaS actually
   provides — rather than baking them in at build time.

   A missing one fails loudly instead of quietly shipping a site that 401s
   against the CMS. */
function required(name) {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. See .env.example.`);
  }
  return value;
}

export const cmsApiUrl = () => required("CMS_API_URL");
export const cmsApiKey = () => required("CMS_API_KEY");
export const revalidationSecret = () => required("REVALIDATION_SECRET");
