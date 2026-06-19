import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchLatestProducts, type ProductPreview } from "@/integrations/wix/products";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const renderStars = (rating: number) => {
  const full = Math.floor(rating);
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < full ? "fill-accent text-accent" : "text-muted"}`} />
      ))}
    </span>
  );
};

const ProductsSection = () => {
  const [products, setProducts] = useState<ProductPreview[]>([]);

  useEffect(() => {
    fetchLatestProducts(5)
      .then(setProducts)
      .catch((err) => console.error("Wix products load failed:", err));
  }, []);

  if (products.length === 0) return null;

  return (
    <section id="products" className="py-24 bg-secondary/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Latest Releases</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3">Fresh from the workshop</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Our newest add-on packs, ready for your roster.</p>
        </motion.div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {products.map((product) => (
            <motion.article key={product.id} variants={item}
              className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-colors group">
              <div className="aspect-[2/1] bg-secondary relative overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[0.65rem] text-muted-foreground px-2 text-center">
                    {product.name}
                  </div>
                )}
                {product.badge && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[0.55rem] font-medium">{product.badge}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground text-sm mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-primary font-semibold text-sm">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-[0.65rem] text-muted-foreground line-through">₹{product.originalPrice}</span>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                    <span className="text-[0.6rem] text-muted-foreground">({product.reviews_count})</span>
                  </div>
                </div>
                <Link to="/products"
                  className="block w-full py-2 rounded-full bg-gradient-accent text-primary-foreground font-medium text-xs text-center hover:-translate-y-0.5 transition-transform">
                  View in Store
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-10">
          <Link to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
            View all products →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
