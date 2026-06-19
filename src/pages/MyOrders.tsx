import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Order = Tables<"orders"> & { product_name?: string | null };

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (data) setOrders(data as Order[]);
      setLoading(false);
    };
    load();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-10">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <ClipboardList size={20} className="text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">My Orders</h1>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ClipboardList size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{(o as any).product_name || "Product"}</p>
                    <p className="text-xs text-muted-foreground">₹{o.amount} · {new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold flex-shrink-0 ${
                    o.status === "fulfilled"
                      ? "bg-green-500/15 text-green-600"
                      : "bg-amber-500/15 text-amber-600"
                  }`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyOrders;
