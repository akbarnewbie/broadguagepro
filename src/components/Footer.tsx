import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {year} BGPro – Broad Gauge Productions.</p>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">YouTube</a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
        </div>
        <p>Created by Akbar Khan</p>
      </div>
    </footer>
  );
};

export default Footer;
