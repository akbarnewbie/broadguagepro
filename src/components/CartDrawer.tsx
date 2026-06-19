import { ShoppingCart, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-accent text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Open cart"
      >
        <ShoppingCart size={22} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[0.65rem] font-bold flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-card border-l border-border flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} className="text-primary" />
                  <h2 className="font-semibold text-foreground">Your Cart</h2>
                  <span className="text-xs text-muted-foreground">({totalItems} items)</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <ShoppingCart size={40} className="mb-3 opacity-30" />
                    <p className="text-sm">Your cart is empty</p>
                    <p className="text-xs mt-1">Browse our add-ons and add something!</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 p-3 rounded-xl border border-border bg-secondary/50">
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.product.image_url ? (
                          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[0.55rem] text-muted-foreground text-center leading-tight px-1">{item.product.type}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.product.sim === "both" ? "OR & MSTS" : item.product.sim === "openrails" ? "Open Rails" : "MSTS"}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold text-primary">₹{item.product.price}</span>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-5 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-lg font-semibold text-foreground">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 rounded-xl bg-gradient-accent text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 transition-transform"
                  >
                    Checkout
                  </button>
                  <button onClick={clearCart} className="w-full py-2 text-xs text-muted-foreground hover:text-destructive transition-colors">
                    Clear cart
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
