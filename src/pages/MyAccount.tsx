import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ClipboardList, LogOut, KeyRound, Star, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";
import type { User as SupaUser } from "@supabase/supabase-js";

type Order = Tables<"orders">;
type Profile = Tables<"profiles">;

const statusStyles: Record<string, string> = {
  payment_pending: "bg-amber-500/15 text-amber-600",
  payment_approved: "bg-blue-500/15 text-blue-600",
  fulfilled: "bg-green-500/15 text-green-600",
  rejected: "bg-red-500/15 text-red-600",
  pending: "bg-amber-500/15 text-amber-600",
};

const statusLabels: Record<string, string> = {
  payment_pending: "Payment Pending",
  payment_approved: "Payment Approved",
  fulfilled: "Fulfilled",
  rejected: "Rejected",
  pending: "Pending",
};

const MyAccount = () => {
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [reviewedOrderIds, setReviewedOrderIds] = useState<Set<string>>(new Set());
  const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);

      const [profileRes, ordersRes, reviewsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", session.user.id).maybeSingle(),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("reviews").select("order_id").eq("user_id", session.user.id),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setDisplayName(profileRes.data.display_name || "");
      }
      if (ordersRes.data) setOrders(ordersRes.data);
      if (reviewsRes.data) setReviewedOrderIds(new Set(reviewsRes.data.map((r: any) => r.order_id)));
      setLoading(false);
    };
    load();
  }, [navigate]);

  const saveDisplayName = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
      setProfile((p) => p ? { ...p, display_name: displayName } : p);
      setEditingName(false);
    }
  };

  const submitReview = async (order: Order) => {
    if (!user || !reviewText.trim()) return;
    setSubmittingReview(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      order_id: order.id,
      product_id: order.product_id,
      product_name: order.product_name || "Product",
      customer_name: profile?.display_name || user.email || "Customer",
      rating: reviewRating,
      review_text: reviewText.trim(),
    } as any);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review submitted! It will appear after approval." });
      setReviewedOrderIds((prev) => new Set(prev).add(order.id));
      setReviewingOrderId(null);
      setReviewText("");
      setReviewRating(5);
    }
    setSubmittingReview(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading…</div>
    </div>
  );

  const filteredOrders = orders.filter((o) =>
    !orderSearch || ((o as any).order_number || "").toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-10">
        <div className="container max-w-3xl">
          <h1 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <User size={22} className="text-primary" /> My Account
          </h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="profile" className="gap-1.5"><User size={14} /> Profile</TabsTrigger>
              <TabsTrigger value="orders" className="gap-1.5"><ClipboardList size={14} /> Orders</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="border border-border rounded-2xl p-6 bg-card space-y-5">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                  <p className="text-sm text-foreground">{user?.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Display Name</p>
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm flex-1"
                      />
                      <button onClick={saveDisplayName} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium">Save</button>
                      <button onClick={() => setEditingName(false)} className="px-3 py-2 rounded-xl border border-border text-muted-foreground text-xs">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-foreground">{profile?.display_name || "—"}</p>
                      <button onClick={() => setEditingName(true)} className="text-xs text-primary hover:underline">Edit</button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Member Since</p>
                  <p className="text-sm text-foreground">{user ? new Date(user.created_at).toLocaleDateString() : "—"}</p>
                </div>

                <div className="pt-3 border-t border-border flex flex-wrap gap-3">
                  <button onClick={() => navigate("/reset-password")} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                    <KeyRound size={14} /> Change Password
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              {orders.length > 0 && (
                <input
                  placeholder="Search by order number…"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm w-full max-w-xs mb-3"
                />
              )}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <ClipboardList size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((o) => {
                    const isReviewed = reviewedOrderIds.has(o.id);
                    const isReviewing = reviewingOrderId === o.id;

                    return (
                      <div key={o.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              <span className="text-muted-foreground font-mono text-xs mr-2">{(o as any).order_number || "—"}</span>
                              {o.product_name || "Product"}
                            </p>
                            <p className="text-xs text-muted-foreground">₹{o.amount} · {new Date(o.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold ${statusStyles[o.status] || statusStyles.pending}`}>
                              {statusLabels[o.status] || o.status}
                            </span>
                            {o.status === "fulfilled" && !isReviewed && (
                              <button
                                onClick={() => setReviewingOrderId(isReviewing ? null : o.id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                              >
                                <MessageSquare size={12} /> Review
                              </button>
                            )}
                            {isReviewed && (
                              <Badge variant="secondary" className="text-[0.65rem]">Reviewed</Badge>
                            )}
                          </div>
                        </div>

                        {/* Review Form */}
                        {isReviewing && (
                          <div className="border-t border-border pt-3 space-y-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setReviewRating(star)}>
                                  <Star
                                    size={18}
                                    className={`transition-colors ${star <= reviewRating ? "fill-accent text-accent" : "text-muted-foreground"}`}
                                  />
                                </button>
                              ))}
                            </div>
                            <Textarea
                              placeholder="Write your review…"
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              className="text-sm"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => submitReview(o)}
                                disabled={submittingReview || !reviewText.trim()}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50"
                              >
                                {submittingReview ? "Submitting…" : "Submit Review"}
                              </button>
                              <button
                                onClick={() => { setReviewingOrderId(null); setReviewText(""); setReviewRating(5); }}
                                className="px-4 py-2 rounded-xl border border-border text-muted-foreground text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyAccount;
