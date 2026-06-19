import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, Train, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart, CartProduct } from "@/contexts/CartContext";
import { fetchCatalogProducts } from "@/integrations/wix/products";

const categories = [
  { value: "all", label: "All Add-ons", icon: "🎯" },
  { value: "locomotive", label: "Locomotives", icon: "🚂" },
  { value: "coach", label: "Coaches", icon: "🚃" },
  { value: "emu", label: "EMU", icon: "🚈" },
  { value: "route", label: "Routes", icon: "🛤️" },
  { value: "bundle", label: "Bundles", icon: "📦" },
];

const sims = [
  { value: "all", label: "Any Simulator" },
  { value: "openrails", label: "Open Rails" },
  { value: "msts", label: "MSTS" },
  { value: "both", label: "Dual-compatible" },
];

const types = [
  { value: "all", label: "All Types" },
  { value: "Electric", label: "Electric Locos" },
  { value: "Diesel", label: "Diesel Locos" },
  { value: "LHB", label: "LHB Coaches" },
  { value: "ICF", label: "ICF Coaches" },
  { value: "EMU", label: "EMU Sets" },
  { value: "Route", label: "Routes" },
  { value: "Bundle", label: "Bundles" },
];

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest" },
];

const ProductsPage = () => {
  const [category, setCategory] = useState("all");
  const [sim, setSim] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const { totalItems, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchCatalogProducts(100);
        setProducts(data);
      } catch (err) {
        console.error("Wix catalog load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (sim !== "all" && p.sim !== sim) return false;
      if (type !== "all" && p.type !== type) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !(p.description || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "popular") return b.reviews_count - a.reviews_count;
      return 0;
    });

    return result;
  }, [category, sim, type, search, sort, products]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-14 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        <div className="container relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Train size={16} className="text-primary" />
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">BGPro Digital Store</p>
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-2">
                Indian Railways Add-ons
              </h1>
              <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                High-fidelity locomotives, coaches, EMU sets and routes for Open Rails & MSTS.
                Handcrafted with authentic Indian Railways detailing.
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
                <p className="text-xs text-muted-foreground">Add-ons</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-xs text-muted-foreground">Simulators</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="grid lg:grid-cols-[260px_1fr] gap-8">
            <aside className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <SlidersHorizontal size={14} />
                Filters
              </div>
              <div>
                <p className="text-[0.65rem] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Category</p>
                <div className="flex flex-col gap-1">
                  {categories.map((c) => (
                    <button key={c.value} onClick={() => { setCategory(c.value); setType("all"); }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all text-left ${category === c.value ? "bg-primary/10 text-primary font-medium border border-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                      <span>{c.icon}</span>{c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[0.65rem] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Type</p>
                <div className="flex flex-wrap gap-1.5">
                  {types.map((t) => (
                    <button key={t.value} onClick={() => setType(t.value)}
                      className={`px-2.5 py-1.5 rounded-full text-[0.65rem] border transition-colors ${type === t.value ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[0.65rem] text-muted-foreground uppercase tracking-wider mb-2 font-medium">Simulator</p>
                <div className="flex flex-col gap-1">
                  {sims.map((s) => (
                    <button key={s.value} onClick={() => setSim(s.value)}
                      className={`px-3 py-2 rounded-lg text-xs transition-all text-left ${sim === s.value ? "bg-primary/10 text-primary font-medium border border-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="text-foreground font-semibold">{filtered.length}</span> add-ons
                </p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search add-ons..."
                      className="w-full sm:w-52 pl-9 pr-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:border-primary transition-colors">
                    {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <button onClick={() => setIsCartOpen(true)}
                    className="relative px-3 py-2 rounded-xl border border-border bg-secondary text-foreground hover:border-primary transition-colors sm:hidden">
                    <ShoppingCart size={16} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[0.55rem] font-bold flex items-center justify-center">{totalItems}</span>
                    )}
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-sm">Loading products…</p>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                  {filtered.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                      <Train size={40} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No add-ons match your filters.</p>
                      <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPage;
