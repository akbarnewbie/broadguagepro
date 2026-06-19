import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";

// Public Headless OAuth client ID (safe for the browser).
// To switch to the live Broad Gauge store later, change only this value
// (ideally via VITE_WIX_CLIENT_ID in your .env) — no other code changes needed.
const CLIENT_ID =
  import.meta.env.VITE_WIX_CLIENT_ID || "afb00922-f388-449c-8114-8b5e83aa4d73";

export const wixClient = createClient({
  modules: { products },
  auth: OAuthStrategy({ clientId: CLIENT_ID }),
});
