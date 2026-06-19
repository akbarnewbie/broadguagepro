import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Copy, CheckCircle2, QrCode } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { placeWixOrder } from "@/integrations/wix/orders";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const UPI_ID = "hakimidigital.ibz@icici";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (items.length === 0) navigate("/products");
  }, [navigate, items.length]);

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      toast({ title: "Email required", description: "Enter a valid email so we can send your download link.", variant: "destructive" });
      return;
    }

    setPlacing(true);
    try {
      const result = await placeWixOrder({
        email,
        lines: items.map((item) => ({
          wixProductId: item.product.id,
          quantity: item.quantity,
        })),
      });

      if (!result.ok) {
        toast({ title: "Order failed", description: result.error, variant: "destructive" });
        return;
      }

      clearCart();
      setShowPayment(false);
      toast({ title: "Order placed! 🎉", description: "We'll verify your payment and email your download link shortly." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-10">
        <div className="container max-w-2xl">
          <h1 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <ShoppingCart size={22} className="text-primary" /> Checkout
          </h1>

          <div className="border border-border rounded-2xl bg-card overflow-hidden">
            {/* Items */}
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.product.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[0.5rem] text-muted-foreground">{item.product.type}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground flex-shrink-0">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Total + Pay */}
            <div className="p-5 border-t border-border bg-secondary/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-xl font-bold text-foreground">₹{totalPrice.toLocaleString()}</span>
              </div>
              <button
                onClick={() => setShowPayment(true)}
                className="w-full py-3 rounded-xl bg-gradient-accent text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 transition-transform"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* UPI Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <QrCode size={18} className="text-primary" /> Pay via UPI
            </DialogTitle>
            <DialogDescription>
              Scan the QR code or use the UPI ID below to complete your payment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* QR Placeholder */}
            <div className="mx-auto w-48 h-48 rounded-2xl border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center text-muted-foreground">
              <QrCode size={48} className="opacity-30 mb-2" />
              <span className="text-xs">QR Code</span>
            </div>

            {/* UPI ID */}
            <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-secondary">
              <span className="text-sm font-mono text-foreground flex-1 truncate">{UPI_ID}</span>
              <button onClick={copyUPI} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                {copied ? <><CheckCircle2 size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>

            {/* Amount */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Amount to Pay</p>
              <p className="text-2xl font-bold text-foreground">₹{totalPrice.toLocaleString()}</p>
            </div>

            {/* Email for download delivery */}
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Email for download link</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Confirm */}
            <button
              onClick={handleConfirmPayment}
              disabled={placing}
              className="w-full py-3 rounded-xl bg-gradient-accent text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 transition-transform disabled:opacity-50"
            >
              {placing ? "Processing…" : "I have paid"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Checkout;
