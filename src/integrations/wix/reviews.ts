import { createClient, OAuthStrategy } from "@wix/sdk";
import { items } from "@wix/data";
import { files } from "@wix/media";

// Wix CMS (Data) + Media client. Uses the same public Client ID.
const CLIENT_ID =
  import.meta.env.VITE_WIX_CLIENT_ID || "afb00922-f388-449c-8114-8b5e83aa4d73";

const dataClient = createClient({
  modules: { items, files },
  auth: OAuthStrategy({ clientId: CLIENT_ID }),
});

// Name of the CMS collection to create in the Wix dashboard.
// Fields expected: customerName (text), productName (text), rating (number),
// reviewText (text), approved (boolean). _createdDate is automatic.
const COLLECTION = "Reviews";

export type Review = {
  id: string;
  customer_name: string | null;
  product_name: string | null;
  rating: number;
  review_text: string;
  created_at: string;
  image_url: string | null;
};

function mapItem(it: any): Review {
  const d = it?.data ?? it; // SDK versions differ on nesting
  return {
    id: it?._id ?? d?._id ?? crypto.randomUUID(),
    customer_name: d?.customerName ?? null,
    product_name: d?.productName ?? null,
    rating: Number(d?.rating ?? 5) || 5,
    review_text: d?.reviewText ?? "",
    created_at: d?._createdDate ?? it?._createdDate ?? new Date().toISOString(),
    image_url: d?.reviewImage ?? null,
  };
}

/**
 * Upload an image file to Wix Media and return its URL.
 * Flow: ask Wix for an upload URL -> PUT the file bytes -> read back the URL.
 * Returns null on failure (so a review can still submit without an image).
 */
export async function uploadReviewImage(file: File): Promise<string | null> {
  try {
    const { uploadUrl } = await dataClient.files.generateFileUploadUrl(
      file.type || "image/jpeg",
      { fileName: file.name }
    );
    if (!uploadUrl) return null;

    // Upload the raw bytes to the provided URL.
    const res = await fetch(`${uploadUrl}?filename=${encodeURIComponent(file.name)}`, {
      method: "PUT",
      headers: { "Content-Type": file.type || "image/jpeg" },
      body: file,
    });
    const body = await res.json().catch(() => ({}));

    // The response shape varies; try the common paths for the resulting URL.
    const fileUrl =
      body?.file?.url ||
      body?.file?.media?.image?.url ||
      body?.url ||
      null;
    return fileUrl;
  } catch (err) {
    console.warn("Image upload failed:", err);
    return null;
  }
}

/** Read approved reviews for the Community page. Returns [] on any error so
 *  the page never breaks (e.g. before the collection exists). */
export async function fetchApprovedReviews(): Promise<Review[]> {
  try {
    const res = await dataClient.items
      .query(COLLECTION)
      .eq("approved", true)
      .descending("_createdDate")
      .find();
    return (res.items ?? []).map(mapItem);
  } catch (err) {
    console.warn("Reviews not available yet (CMS collection may not exist):", err);
    return [];
  }
}

/** Submit a new review. Lands as approved=false for moderation in the Wix
 *  dashboard CMS. */
export async function submitReview(input: {
  customerName: string;
  productName?: string;
  rating: number;
  reviewText: string;
  imageUrl?: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    await dataClient.items.insert(COLLECTION, {
      customerName: input.customerName,
      productName: input.productName ?? "",
      rating: input.rating,
      reviewText: input.reviewText,
      reviewImage: input.imageUrl ?? "",
      approved: false,
    });
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Could not submit review." };
  }
}
