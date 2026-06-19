import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut, User, ShieldCheck, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/BGP_Logo.png";
import { useTheme } from "@/hooks/use-theme";
import SaleBanner from "@/components/SaleBanner";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Community", to: "/community" },
  { label: "Contact", to: "/#contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupaUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkAdmin(u.id); else setIsAdmin(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) checkAdmin(u.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0];

  const userLinks = (
    <>
      {user && (
        <Link to="/my-account" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
          <User size={14} /> My Account
        </Link>
      )}
      {isAdmin && (
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
          <ShieldCheck size={14} /> Admin
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 glass-surface">
      <SaleBanner />      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="BGPro logo" className="h-10 w-10 rounded-full" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-widest uppercase text-foreground">BGPro</span>
            <span className="text-xs text-muted-foreground">Broad Gauge Productions</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to}
              className={`text-sm transition-colors hover:text-primary ${location.pathname === link.to ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {link.label}
            </Link>
          ))}
          {userLinks}
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground flex items-center gap-1.5"><User size={14} />{displayName}</span>
              <button onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors flex items-center gap-1.5">
                <LogOut size={14} /> Log Out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="text-sm px-4 py-2 rounded-full border border-border text-foreground hover:border-primary hover:text-primary transition-colors">
              Log In
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <button onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border overflow-hidden">
            <div className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)}
                  className="text-sm text-muted-foreground hover:text-primary py-1">{link.label}</Link>
              ))}
              {user && (
                <>
                  <Link to="/my-account" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-primary py-1 flex items-center gap-1.5">
                    <User size={14} /> My Account
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-primary py-1 flex items-center gap-1.5">
                      <ShieldCheck size={14} /> Admin
                    </Link>
                  )}
                  <span className="text-sm text-foreground flex items-center gap-1.5 py-1"><User size={14} /> {displayName}</span>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="text-sm text-muted-foreground hover:text-destructive py-1 flex items-center gap-1.5 text-left">
                    <LogOut size={14} /> Log Out
                  </button>
                </>
              )}
              {!user && (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground hover:text-primary py-1">Log In</Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
