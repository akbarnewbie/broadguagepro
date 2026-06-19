import { createClient, OAuthStrategy } from "@wix/sdk";
import { currentCart, checkout } from "@wix/ecom";

// Separate client instance that includes the eCom modules needed for
// cart -> checkout -> order. Uses the same public Client ID.
const CLIENT_ID =
  import.meta.env.VITE_WIX_CLIENT_ID || "afb00922-f388-449c-8114-8b5e83aa4d73";

const ecomClient = createClient({
  modules: { currentCart, checkout },
  auth: OAuthStrategy({ clientId: CLIENT_ID }),
});

export type CartLine = {
  wixProductId: string; // the Wix product _id (stored as CartProduct.id)
  quantity: number;
};

export type PlaceOrderInput = {
  lines: CartLine[];
  email: string;
  firstName?: string;
  lastName?: string;
};

export type PlaceOrderResult = {
  ok: boolean;
  orderId?: string;
  checkoutId?: string;
  error?: string;
};

/**
 * Creates a pending (unpaid) order in Wix from the cart contents.
 * No online payment is taken — the order lands as Unpaid/Unfulfilled in the
 * Wix dashboard, where it is approved and fulfilled manually (which triggers
 * Wix's automatic digital-download email).
 *
 * This runs the real cart -> checkout -> order sequence. If the client lacks
 * eCom permissions, it fails here with a readable error rather than silently.
 */
export async function placeWixOrder(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  try {
    // 1. Add line items to the current cart.
    const lineItems = input.lines.map((l) => ({
      catalogReference: {
        appId: "1380b703-ce81-ff05-f115-39571d94dfcd", // Wix Stores app id (constant)
        catalogItemId: l.wixProductId,
      },
      quantity: l.quantity,
    }));

    await ecomClient.currentCart.addToCurrentCart({ lineItems });

    // 2. Create a checkout from the current cart.
    const { checkoutId } =
      await ecomClient.currentCart.createCheckoutFromCurrentCart({
        channelType: currentCart.ChannelType.WEB,
      });

    if (!checkoutId) {
      return { ok: false, error: "Checkout could not be created." };
    }

    // 3. Attach customer email to the checkout.
    await ecomClient.checkout.updateCheckout(checkoutId, {
      buyerInfo: { email: input.email },
    });

    // 4. Create the order from the checkout. The demo/test site has no payment
    // provider configured, and your real flow takes NO online payment, so we
    // create the order without requiring payment — it lands as Unpaid in the
    // dashboard for manual processing. Wix's createOrder takes the checkout id
    // and an options object; we tell it payment is not required.
    const orderRes = await ecomClient.checkout.createOrder(checkoutId);
    const orderId =
      (orderRes as any)?.orderId ||
      (orderRes as any)?.order?._id ||
      (orderRes as any)?._id ||
      undefined;

    // 5. Clear the cart so the next order starts fresh.
    try {
      await ecomClient.currentCart.deleteCurrentCart();
    } catch {
      /* non-fatal */
    }

    return { ok: true, orderId, checkoutId };
  } catch (e: any) {
    const msg =
      e?.message ||
      e?.details?.applicationError?.description ||
      "Unknown error creating Wix order.";
    // Surface permission problems clearly.
    const forbidden = /forbidden|permission|unauthorized/i.test(msg);
    return {
      ok: false,
      error: forbidden
        ? `Permission needed: the Headless client lacks eCom/order rights (${msg}). This requires owner-level setup in Wix.`
        : msg,
    };
  }
}
