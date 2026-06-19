import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", projectType: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", projectType: "", message: "" });
  };

  return (
    <section id="contact" className="py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Contact</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Ready to bring your railway to life?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Tell us a bit about your setup and what you'd love to build. We'll get back with ideas, timelines, and options.
            </p>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Typical response time</p>
                <p className="text-sm font-medium text-foreground">Under 24 hours</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Project types</p>
                <p className="text-sm font-medium text-foreground">Sim setups, overlays, TrainBoards</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl border border-border bg-card space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm text-foreground mb-1.5">Name</label>
              <input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Akbar Khan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-foreground mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label htmlFor="projectType" className="block text-sm text-foreground mb-1.5">What are you interested in?</label>
              <select
                id="projectType"
                value={form.projectType}
                onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Select an option</option>
                <option value="trainboards">TrainBoards / overlays</option>
                <option value="simulation">Simulation setup</option>
                <option value="creator">Creator tools / packs</option>
                <option value="other">Something else</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-foreground mb-1.5">Tell us more</label>
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Share a bit about your idea, setup, and timeline."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-accent text-primary-foreground font-medium text-sm hover:-translate-y-0.5 transition-transform shadow-lg"
            >
              Send message
            </button>
            <p className="text-xs text-muted-foreground text-center">
              This is a demo form. Hook it up to your preferred backend.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
