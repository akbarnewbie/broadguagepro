import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-train.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Train at golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border text-xs font-medium text-primary mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
              Hyper-realistic train simulations
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6"
          >
            <span className="text-gradient">A place where trains</span>
            <br />
            <span className="text-foreground">come alive</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-muted-foreground text-lg mb-8 max-w-lg"
          >
            Experience true-to-life simulation with meticulously handcrafted models.
            Every detail is dedicated to delivering realism.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-accent text-primary-foreground font-medium text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Explore Products
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-secondary/50"
          >
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Community</span>
              <span className="text-sm font-semibold text-foreground">1000+ BGPro's family</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border border-border flex items-start justify-center pt-2">
          <div className="w-1 h-2.5 rounded-full bg-muted-foreground animate-scroll-down" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
