import { wixClient } from "./client";

// The shape your existing UI already expects.
export type ProductPreview = {
  id: string;
  name: string;
  description: string | null;
  price: number;           // the price to charge (discounted if on sale)
  originalPrice: number | null; // base price if discounted, else null
  formattedPrice: string | null; // Wix's currency-formatted price
  rating: number;
  reviews_count: number;
  badge: string | null;
  image_url: string | null;
  slug?: string | null;
};

// Wix product objects are richly nested and field names have shifted across
// SDK versions, so we read defensively: try the known paths, fall back safely.
function mapWixProduct(p: any): ProductPreview {
  const pd = p?.priceData ?? p?.convertedPriceData ?? {};

  const base = Number(pd?.price ?? p?.price?.price ?? 0) || 0;
  // discountedPrice reflects product-level sales set in Wix.
  const discounted = Number(pd?.discountedPrice ?? base) || base;

  const onSale = discounted < base;
  const sellingPrice = onSale ? discounted : base;

  const formatted =
    pd?.formatted?.discountedPrice ??
    pd?.formatted?.price ??
    null;

  const image =
    p?.media?.mainMedia?.image?.url ??
    p?.media?.items?.[0]?.image?.url ??
    null;

  // Strip HTML from Wix rich descriptions for the card preview.
  const rawDesc: string | null = p?.description ?? null;
  const description = rawDesc
    ? rawDesc.replace(/<[^>]*>/g, "").trim() || null
    : null;

  // Wix Stores has no built-in star rating; default until we wire reviews.
  return {
    id: p?._id ?? p?.id ?? crypto.randomUUID(),
    name: p?.name ?? "Untitled",
    description,
    price: sellingPrice,
    originalPrice: onSale ? base : null,
    formattedPrice: formatted,
    rating: 5,
    reviews_count: 0,
    badge: p?.ribbon || null,
    image_url: image,
    slug: p?.slug ?? null,
  };
}

export async function fetchProducts(limit = 100): Promise<ProductPreview[]> {
  const res = await wixClient.products.queryProducts().limit(limit).find();
  return (res.items ?? []).map(mapWixProduct);
}

export async function fetchLatestProducts(limit = 5): Promise<ProductPreview[]> {
  // Wix sort fields vary; fetch then slice to stay version-safe.
  const all = await fetchProducts(Math.max(limit, 20));
  return all.slice(0, limit);
}

// ---- Full catalog mapping (Products page) --------------------------------
// The catalog page needs extra fields (category, sim, tag, type) that Wix
// Stores does not have natively. We derive them from Wix data where possible
// and default the rest so filters/sorting work without crashing. When you
// move to the live store, these can be backed by Wix product options,
// collections, or custom fields.

export type CatalogProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews_count: number;
  category: string;
  sim: string;
  tag: string | null;
  badge: string | null;
  type: string;
  image_url: string | null;
  slug?: string | null;
};

function mapWixCatalogProduct(p: any): CatalogProduct {
  const base = mapWixProduct(p);

  // Wix product collections (if any) can later drive category; default "all"
  // so every product passes the "All" filter.
  return {
    ...base,
    category: "all",
    sim: "all",
    tag: p?.ribbon || null,
    type: "all",
  };
}

export async function fetchCatalogProducts(limit = 100): Promise<CatalogProduct[]> {
  const res = await wixClient.products.queryProducts().limit(limit).find();
  return (res.items ?? []).map(mapWixCatalogProduct);
}
