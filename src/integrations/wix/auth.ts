import { createClient, OAuthStrategy } from "@wix/sdk";

const CLIENT_ID =
  import.meta.env.VITE_WIX_CLIENT_ID || "afb00922-f388-449c-8114-8b5e83aa4d73";

// Persist tokens so the member stays logged in across page reloads.
const TOKEN_KEY = "wix_member_tokens";

function loadTokens() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const authClient = createClient({
  auth: OAuthStrategy({
    clientId: CLIENT_ID,
    tokens: loadTokens() || undefined,
  }),
});

function saveTokens(tokens: any) {
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  } catch {
    /* ignore */
  }
}

export async function wixLogin(email: string, password: string) {
  try {
    const result: any = await authClient.auth.login({ email, password });

    // Some flows return tokens directly; others return a state needing follow-up.
    if (result?.loginState === "SUCCESS" || result?.data?.stateKind === "success") {
      const tokens = await authClient.auth.getMemberTokensForDirectLogin(
        result.data?.sessionToken || result.sessionToken
      );
      authClient.auth.setTokens(tokens);
      saveTokens(tokens);
      return { ok: true };
    }

    // If already returns tokens
    if (result?.accessToken) {
      authClient.auth.setTokens(result);
      saveTokens(result);
      return { ok: true };
    }

    return {
      ok: false,
      state: result?.loginState,
      error: `Login could not complete (state: ${result?.loginState ?? "unknown"}).`,
    };
  } catch (e: any) {
    const msg = e?.message || e?.details?.applicationError?.description || "Login failed.";
    console.error("Wix login error:", e);
    return { ok: false, error: msg };
  }
}

export async function wixRegister(email: string, password: string, firstName?: string) {
  try {
    const result: any = await authClient.auth.register({
      email,
      password,
      profile: firstName ? { nickname: firstName } : undefined,
    });

    if (result?.loginState === "SUCCESS") {
      const tokens = await authClient.auth.getMemberTokensForDirectLogin(
        result.data?.sessionToken
      );
      authClient.auth.setTokens(tokens);
      saveTokens(tokens);
      return { ok: true };
    }
    // Often registration requires email verification before login.
    return {
      ok: false,
      state: result?.loginState,
      error: `Account may need email verification (state: ${result?.loginState ?? "unknown"}).`,
    };
  } catch (e: any) {
    const msg = e?.message || e?.details?.applicationError?.description || "Sign up failed.";
    console.error("Wix register error:", e);
    return { ok: false, error: msg };
  }
}

export async function wixLogout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function isLoggedIn(): boolean {
  try {
    return authClient.auth.loggedIn();
  } catch {
    return false;
  }
}

export async function sendReset(email: string) {
  try {
    await authClient.auth.sendPasswordResetEmail(email, window.location.origin);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message };
  }
}
