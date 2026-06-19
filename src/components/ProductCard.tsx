import { motion } from "framer-motion";
import { Star, ShoppingCart, Monitor } from "lucide-react";
import { useCart, CartProduct } from "@/contexts/CartContext";

const simLabel = (sim: string) =>
  sim === "both" ? "Open Rails & MSTS" : sim === "openrails" ? "Open Rails" : "MSTS";

const categoryIcon: Record<string, string> = {
  locomotive: "🚂",
  coach: "🚃",
  emu: "🚈",
  route: "🛤️",
  bundle: "📦",
};

const ProductCard = ({ product, index }: { product: CartProduct; index: number }) => {
  const { addToCart } = useCart();
  const fullStars = Math.floor(product.rating);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all group hover:shadow-lg"
    >
      <div className="aspect-[2.2/1] bg-secondary relative overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-20 group-hover:scale-110 transition-transform duration-500">
              {categoryIcon[product.category] || "📦"}
            </span>
          </div>
        )}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-[0.6rem] font-semibold backdrop-blur-sm border border-primary/20">
              {product.badge}
            </span>
          </div>
        )}
        <div className="absolute top-2.5 right-2.5">
          <span className="px-2 py-0.5 rounded-full bg-card/80 text-foreground text-[0.55rem] font-medium backdrop-blur-sm border border-border">
            {product.type}
          </span>
        </div>
        <div className="absolute bottom-2 right-2.5 flex items-center gap-1">
          <Monitor size={10} className="text-muted-foreground" />
          <span className="text-[0.55rem] text-muted-foreground">{simLabel(product.sim)}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < fullStars ? "fill-accent text-accent" : "text-muted"}`} />
            ))}
          </div>
          <span className="text-[0.65rem] text-muted-foreground">
            {product.rating} ({product.reviews_count})
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-lg font-bold text-primary">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-1.5">₹{product.originalPrice}</span>
            )}
            <span className="text-[0.6rem] text-muted-foreground ml-1">INR</span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-accent text-primary-foreground font-medium text-xs hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            <ShoppingCart size={13} />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
