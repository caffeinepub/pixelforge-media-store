import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

export default function Navbar() {
  const { identity, login, clear } = useInternetIdentity();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const principal = identity?.getPrincipal();
  const isLoggedIn = principal && !principal.isAnonymous();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/shop", search: { q: searchQuery.trim() } });
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl flex-shrink-0"
          data-ocid="nav.home_link"
        >
          <img
            src="/assets/generated/navbar-logo-transparent.png"
            alt="PixelKart logo"
            className="w-16 h-16 object-contain"
          />
          <span className="text-foreground">
            Pixel<span className="text-primary">Kart</span>
          </span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.shop_link"
          >
            Shop
          </Link>
          <Link
            to="/shop"
            search={{ category: "personalCare" }}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.personal_care_link"
          >
            Personal Care
          </Link>
          <Link
            to="/shop"
            search={{ category: "electronics" }}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.electronics_link"
          >
            Electronics
          </Link>
          <Link
            to="/shop"
            search={{ category: "homeGoods" }}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.home_goods_link"
          >
            Home Goods
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                autoFocus
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 h-8 text-sm"
                data-ocid="nav.search_input"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Search"
              data-ocid="nav.search_button"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
          )}

          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/orders"
                className="text-sm text-muted-foreground hover:text-foreground px-2 py-1"
                data-ocid="nav.orders_link"
              >
                My Orders
              </Link>
              <button
                type="button"
                onClick={clear}
                className="text-sm text-muted-foreground hover:text-foreground px-2 py-1"
                data-ocid="nav.logout_button"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={login}
              className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
              data-ocid="nav.login_button"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}

          <Link
            to="/cart"
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Cart"
            data-ocid="nav.cart_link"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground rounded-full">
                {totalItems}
              </Badge>
            )}
          </Link>

          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 flex flex-col gap-3">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium py-1"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium py-1"
            data-ocid="nav.shop_link"
          >
            Shop All
          </Link>
          <Link
            to="/shop"
            search={{ category: "personalCare" }}
            onClick={() => setMobileOpen(false)}
            className="text-sm text-muted-foreground py-1"
          >
            Personal Care
          </Link>
          <Link
            to="/shop"
            search={{ category: "electronics" }}
            onClick={() => setMobileOpen(false)}
            className="text-sm text-muted-foreground py-1"
          >
            Electronics
          </Link>
          <Link
            to="/shop"
            search={{ category: "homeGoods" }}
            onClick={() => setMobileOpen(false)}
            className="text-sm text-muted-foreground py-1"
          >
            Home Goods
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium py-1"
            data-ocid="nav.cart_link"
          >
            Cart ({totalItems})
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileOpen(false)}
                className="text-sm py-1"
                data-ocid="nav.orders_link"
              >
                My Orders
              </Link>
              <button
                type="button"
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
                className="text-sm text-left py-1"
                data-ocid="nav.logout_button"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                login();
                setMobileOpen(false);
              }}
              className="text-sm font-medium text-left py-1"
              data-ocid="nav.login_button"
            >
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
}
