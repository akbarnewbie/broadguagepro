import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Review = {
  id: string;
  customer_name: string | null;
  product_name: string | null;
  rating: number;
  review_text: string;
};

const renderStars = (rating: number) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-accent text-accent" : "text-muted"}`} />
    ))}
  </span>
);

const CommunitySection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("id, customer_name, product_name, rating, review_text")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setReviews(data as Review[]);
      });
  }, []);

  return (
    <section id="community" className="py-24 bg-secondary/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Community</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3">
            A vibrant railfan family
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Don't just take our word for it—hear from the community that drives BGPro forward every day.
          </p>
        </motion.div>

        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {reviews.slice(0, 3).map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card relative hover:border-primary/20 transition-colors"
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
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-3">{review.review_text}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center mb-10">No reviews yet. Be the first to share your experience!</p>
        )}

        {/* Social + CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/community"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-accent text-primary-foreground text-sm font-medium hover:-translate-y-0.5 transition-transform"
          >
            Read all reviews →
          </Link>
          <div className="flex gap-3">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors">
              <Instagram className="w-3.5 h-3.5" /> Instagram
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors">
              <Youtube className="w-3.5 h-3.5" /> YouTube
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
