import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Instagram, Youtube } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { fetchApprovedReviews, submitReview, uploadReviewImage, type Review } from "@/integrations/wix/reviews";
import { useToast } from "@/hooks/use-toast";

const stats = [
  { label: "Active Members", value: "2,500+" },
  { label: "Average Rating", value: "4.8★" },
  { label: "Add-ons Downloaded", value: "12,000+" },
  { label: "Countries", value: "15+" },
];

const renderStars = (rating: number) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-accent text-accent" : "text-muted"}`} />
    ))}
  </span>
);

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

const CommunityPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Review submission form state
  const [form, setForm] = useState({ customerName: "", productName: "", rating: 5, reviewText: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!form.customerName.trim() || !form.reviewText.trim()) {
      toast({ title: "Please fill in your name and review", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = await uploadReviewImage(imageFile);
      if (!imageUrl) {
        toast({ title: "Image upload failed", description: "Submitting review without the image.", variant: "destructive" });
      }
    }

    const result = await submitReview({ ...form, imageUrl });
    setSubmitting(false);
    if (result.ok) {
      toast({ title: "Review submitted! 🎉", description: "It will appear once approved." });
      setForm({ customerName: "", productName: "", rating: 5, reviewText: "" });
      setImageFile(null);
    } else {
      toast({ title: "Could not submit", description: result.error, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchApprovedReviews()
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="py-20 border-b border-border">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Community</p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3">
              Trusted by railfans across the country
            </h1>
            <p className="text-muted-foreground">
              Real reviews from real simulation enthusiasts. See why the BGPro community keeps coming back.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {stats.map((s) => (
              <div key={s.label} className="p-5 rounded-2xl border border-border bg-card text-center">
                <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* All Reviews */}
      <section className="py-16">
        <div className="container">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-6">Customer Reviews</p>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No approved reviews yet. Be the first!</p>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  variants={item}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors relative"
                >
                  <Quote className="w-6 h-6 text-primary/10 absolute top-5 right-5" />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {(review.customer_name || "C").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{review.customer_name || "Customer"}</p>
                      <p className="text-[0.65rem] text-primary font-medium">{review.product_name || "Product"}</p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-4">{review.review_text}</p>
                  {review.image_url && (
                    <img src={review.image_url} alt="Review" className="mt-3 rounded-lg w-full h-32 object-cover" />
                  )}
                  <div className="mt-4">
                    <span className="text-[0.65rem] text-muted-foreground">{formatDate(review.created_at)}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Write a Review */}
      <section className="py-16 border-t border-border">
        <div className="container max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Share your experience</p>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Write a review</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="text"
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              placeholder="Which product? (optional)"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rating:</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}>
                  <Star className={`w-6 h-6 ${n <= form.rating ? "fill-accent text-accent" : "text-muted"}`} />
                </button>
              ))}
            </div>
            <textarea
              value={form.reviewText}
              onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
              placeholder="Tell us what you think..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Add a photo (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer"
              />
              {imageFile && <p className="text-xs text-muted-foreground mt-1">Selected: {imageFile.name}</p>}
            </div>
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-gradient-accent text-primary-foreground text-sm font-medium hover:-translate-y-0.5 transition-transform disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit review"}
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">
              Join the BGPro community
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Follow us for dev logs, community highlights, and behind-the-scenes content.
            </p>
            <div className="flex justify-center gap-3 mb-6">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Youtube className="w-4 h-4" /> YouTube
              </a>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-accent text-primary-foreground text-sm font-medium hover:-translate-y-0.5 transition-transform">
              Browse our add-ons →
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CommunityPage;
