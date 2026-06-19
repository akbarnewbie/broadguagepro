import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ClipboardList, Plus, Pencil, Trash2, Check, X, Upload, ExternalLink, MessageSquare, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products"> & { google_drive_url?: string | null };
type Order = Tables<"orders"> & { customer_email?: string | null; product_name?: string | null; notes?: string | null };

type Review = {
  id: string;
  user_id: string;
  order_id: string;
  product_id: string;
  product_name: string | null;
  customer_name: string | null;
  rating: number;
  review_text: string;
  status: string;
  created_at: string;
};

const categories = ["locomotive", "coach", "emu", "route", "bundle"];
const simOptions = ["both", "openrails", "msts"];
const typeOptions = ["Electric", "Diesel", "LHB", "ICF", "EMU", "Route", "Bundle"];

const emptyProduct = {
  name: "", description: "", price: 0, category: "locomotive", sim: "both",
  type: "Electric", badge: "", tag: "", google_drive_url: "", is_published: false,
};

const Admin = () => {
  const { isAdmin, loading } = useAdminCheck();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<"products" | "orders" | "reviews">("products");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState("");

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);

  const filteredOrders = orders.filter((o) =>
    !orderSearch || ((o as any).order_number || "").toLowerCase().includes(orderSearch.toLowerCase())
  );

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/");
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchOrders();
      fetchReviews();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data as Product[]);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
  };

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (data) setReviews(data as Review[]);
  };

  const handleImageUpload = async (productId: string): Promise<string | null> => {
    if (!imageFile) return null;
    const ext = imageFile.name.split(".").pop();
    const path = `${productId}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, imageFile, { upsert: true });
    if (error) {
      toast({ title: "Image upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const saveProduct = async () => {
    if (!editingProduct?.name) return;
    setUploading(true);

    try {
      if (isCreating) {
        const { data, error } = await supabase.from("products").insert({
          name: editingProduct.name,
          description: editingProduct.description || "",
          price: editingProduct.price || 0,
          category: editingProduct.category || "locomotive",
          sim: editingProduct.sim || "both",
          type: editingProduct.type || "Electric",
          badge: editingProduct.badge || null,
          tag: editingProduct.tag || null,
          google_drive_url: (editingProduct as any).google_drive_url || null,
          is_published: editingProduct.is_published ?? false,
        }).select().single();

        if (error) throw error;
        if (data && imageFile) {
          const imageUrl = await handleImageUpload(data.id);
          if (imageUrl) {
            await supabase.from("products").update({ image_url: imageUrl }).eq("id", data.id);
          }
        }
      } else {
        const id = editingProduct.id!;
        let imageUrl = editingProduct.image_url;
        if (imageFile) {
          imageUrl = await handleImageUpload(id);
        }
        const { error } = await supabase.from("products").update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          category: editingProduct.category,
          sim: editingProduct.sim,
          type: editingProduct.type,
          badge: editingProduct.badge || null,
          tag: editingProduct.tag || null,
          google_drive_url: (editingProduct as any).google_drive_url || null,
          is_published: editingProduct.is_published,
          image_url: imageUrl,
        }).eq("id", id);
        if (error) throw error;
      }

      toast({ title: "Product saved!" });
      setEditingProduct(null);
      setIsCreating(false);
      setImageFile(null);
      fetchProducts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  const rejectOrder = async (orderId: string) => {
    const { error } = await supabase.from("orders").update({ status: "rejected" }).eq("id", orderId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Order rejected" });
      fetchOrders();
    }
  };

  const approvePayment = async (orderId: string) => {
    const { error } = await supabase.from("orders").update({ status: "payment_approved" }).eq("id", orderId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Payment approved ✓" });
      fetchOrders();
    }
  };

  const fulfillOrder = async (orderId: string) => {
    const { error } = await supabase.from("orders").update({ status: "fulfilled" }).eq("id", orderId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Order fulfilled ✓" });
      fetchOrders();
    }
  };

  const updateReviewStatus = async (reviewId: string, status: string) => {
    const { error } = await supabase.from("reviews").update({ status } as any).eq("id", reviewId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Review ${status}` });
      fetchReviews();
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-10">
        <div className="container max-w-5xl">
          <h1 className="text-2xl font-semibold text-foreground mb-6">Admin Dashboard</h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: "products" as const, label: "Products", icon: Package },
              { key: "orders" as const, label: "Orders", icon: ClipboardList },
              { key: "reviews" as const, label: "Reviews", icon: MessageSquare },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          {/* Products Tab */}
          {tab === "products" && (
            <div className="space-y-4">
              {!editingProduct && (
                <button
                  onClick={() => { setEditingProduct({ ...emptyProduct }); setIsCreating(true); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus size={16} /> Add Product
                </button>
              )}

              {editingProduct && (
                <div className="border border-border rounded-2xl p-5 bg-card space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">{isCreating ? "New Product" : "Edit Product"}</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input placeholder="Name" value={editingProduct.name || ""} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm" />
                    <input placeholder="Price" type="number" value={editingProduct.price || 0} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm" />
                    <select value={editingProduct.category || "locomotive"} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm">
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={editingProduct.sim || "both"} onChange={(e) => setEditingProduct({ ...editingProduct, sim: e.target.value })} className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm">
                      {simOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={editingProduct.type || "Electric"} onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value })} className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm">
                      {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input placeholder="Badge (e.g. Best Seller)" value={editingProduct.badge || ""} onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })} className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm" />
                    <input placeholder="Tag (e.g. new, top, sale)" value={editingProduct.tag || ""} onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })} className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm" />
                    <input placeholder="Google Drive URL" value={(editingProduct as any).google_drive_url || ""} onChange={(e) => setEditingProduct({ ...editingProduct, google_drive_url: e.target.value })} className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm" />
                  </div>
                  <textarea placeholder="Description" value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm min-h-[80px]" />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                      <Upload size={14} />
                      <span>Product Image</span>
                      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                    {imageFile && <span className="text-xs text-muted-foreground">{imageFile.name}</span>}
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={editingProduct.is_published ?? false} onChange={(e) => setEditingProduct({ ...editingProduct, is_published: e.target.checked })} />
                      Published
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveProduct} disabled={uploading} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
                      {uploading ? "Saving…" : "Save"}
                    </button>
                    <button onClick={() => { setEditingProduct(null); setIsCreating(false); setImageFile(null); }} className="px-4 py-2 rounded-xl border border-border text-muted-foreground text-sm hover:text-foreground">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Product List */}
              <div className="space-y-2">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-3 min-w-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xs">{p.type}</div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">₹{p.price} · {p.category} · {p.is_published ? "Published" : "Draft"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {(p as any).google_drive_url && (
                        <a href={(p as any).google_drive_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button onClick={() => { setEditingProduct({ ...p }); setIsCreating(false); }} className="text-muted-foreground hover:text-primary transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No products yet.</p>}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {tab === "orders" && (
            <div className="space-y-3">
              <input
                placeholder="Search by order number…"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm w-full max-w-xs"
              />
              {filteredOrders.map((o) => {
                const product = products.find((p) => p.id === o.product_id);
                const driveUrl = product?.google_drive_url;

                const statusStyle =
                  o.status === "fulfilled" ? "bg-green-500/15 text-green-600"
                  : o.status === "payment_approved" ? "bg-blue-500/15 text-blue-600"
                  : o.status === "rejected" ? "bg-red-500/15 text-red-600"
                  : "bg-amber-500/15 text-amber-600";

                const statusLabel =
                  o.status === "fulfilled" ? "Fulfilled"
                  : o.status === "payment_approved" ? "Payment Approved"
                  : o.status === "payment_pending" ? "Payment Pending"
                  : o.status === "rejected" ? "Rejected"
                  : o.status;

                return (
                  <div key={o.id} className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        <span className="text-muted-foreground font-mono text-xs mr-2">{(o as any).order_number || "—"}</span>
                        {o.product_name || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {o.customer_email || "—"} · ₹{o.amount} · {new Date(o.created_at).toLocaleDateString()}
                      </p>
                      {o.notes && <p className="text-xs text-muted-foreground mt-1">Note: {o.notes}</p>}
                      {driveUrl && (
                        <a href={driveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                          <ExternalLink size={12} /> Google Drive Link
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold ${statusStyle}`}>
                        {statusLabel}
                      </span>
                      {o.status === "payment_pending" && (
                        <>
                          <button onClick={() => approvePayment(o.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:opacity-90 transition-opacity">
                            <Check size={12} /> Approve
                          </button>
                          <button onClick={() => rejectOrder(o.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                            <X size={12} /> Reject
                          </button>
                        </>
                      )}
                      {o.status === "payment_approved" && (
                        <button onClick={() => fulfillOrder(o.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                          <Check size={12} /> Fulfill
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredOrders.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">{orderSearch ? "No matching orders." : "No orders yet."}</p>}
            </div>
          )}

          {/* Reviews Tab */}
          {tab === "reviews" && (
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No reviews yet.</p>
              ) : (
                reviews.map((r) => {
                  const statusStyle =
                    r.status === "approved" ? "bg-green-500/15 text-green-600"
                    : r.status === "rejected" ? "bg-red-500/15 text-red-600"
                    : "bg-amber-500/15 text-amber-600";

                  return (
                    <div key={r.id} className="p-4 rounded-xl border border-border bg-card space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.customer_name || "Customer"}</p>
                          <p className="text-xs text-primary font-medium">{r.product_name || "Product"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold capitalize ${statusStyle}`}>
                            {r.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} className={s <= r.rating ? "fill-accent text-accent" : "text-muted"} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{r.review_text}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[0.65rem] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                        {r.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => updateReviewStatus(r.id, "approved")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:opacity-90">
                              <Check size={12} /> Approve
                            </button>
                            <button onClick={() => updateReviewStatus(r.id, "rejected")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90">
                              <X size={12} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Admin;
