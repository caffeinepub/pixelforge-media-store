import { Link } from "@tanstack/react-router";
import { ArrowRight, Facebook, Instagram, Twitter } from "lucide-react";
import { ShoppingCart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-3">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span>
              Pixel<span className="text-primary">Kart</span>
            </span>
          </div>
          <p className="text-sm text-white/60 mb-4">
            Your one-stop shop for daily essentials and trending products across
            personal care, electronics, and home goods.
          </p>
          <div className="flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <p className="font-semibold mb-4 text-sm uppercase tracking-wide text-white/40">
            Shop
          </p>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>
              <Link
                to="/shop"
                search={{ category: "personalCare" }}
                className="hover:text-white transition-colors"
              >
                Personal Care
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                search={{ category: "electronics" }}
                className="hover:text-white transition-colors"
              >
                Electronics
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                search={{ category: "homeGoods" }}
                className="hover:text-white transition-colors"
              >
                Home Goods
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-white transition-colors">
                Trending Now
              </Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <p className="font-semibold mb-4 text-sm uppercase tracking-wide text-white/40">
            Account
          </p>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li>
              <Link to="/cart" className="hover:text-white transition-colors">
                My Cart
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-white transition-colors">
                Order History
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-white transition-colors">
                Admin Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="font-semibold mb-4 text-sm uppercase tracking-wide text-white/40">
            Stay Updated
          </p>
          <p className="text-sm text-white/60 mb-3">
            Get deals and trending picks in your inbox.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-sm text-white placeholder:text-white/40 border border-white/20 focus:outline-none focus:border-primary"
            />
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:bg-orange-600 transition-colors flex-shrink-0"
              aria-label="Subscribe to newsletter"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              className="text-primary hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </span>
          <div className="flex items-center gap-2">
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">
              VISA
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">MC</span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">
              AMEX
            </span>
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">
              PayPal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
