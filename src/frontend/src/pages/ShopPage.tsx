import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { SlidersHorizontal, Star, X } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import { useCart } from "../context/CartContext";
import {
  CATEGORY_LABELS,
  type ProductCategory,
  SAMPLE_PRODUCTS,
} from "../data/sampleProducts";

const CATEGORIES: ProductCategory[] = [
  "personalCare",
  "electronics",
  "homeGoods",
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function ShopPage() {
  const search = useSearch({ from: "/shop" }) as {
    category?: string;
    q?: string;
  };
  const navigate = useNavigate();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    Set<ProductCategory>
  >(() =>
    search.category ? new Set([search.category as ProductCategory]) : new Set(),
  );
  const [searchQuery, setSearchQuery] = useState(search.q ?? "");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "rating"
  >("default");

  const { addItem } = useCart();

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      const newSearch: Record<string, string> = {};
      if (next.size === 1) newSearch.category = [...next][0];
      navigate({ to: "/shop", search: newSearch });
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = [...SAMPLE_PRODUCTS];
    if (selectedCategories.size > 0) {
      list = list.filter((p) => selectedCategories.has(p.category));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    if (sortBy === "price-asc")
      list.sort((a, b) => a.priceCents - b.priceCents);
    else if (sortBy === "price-desc")
      list.sort((a, b) => b.priceCents - a.priceCents);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [selectedCategories, searchQuery, sortBy]);

  const handleAddToCart = (product: (typeof SAMPLE_PRODUCTS)[0]) => {
    addItem({
      productId: product.id,
      productName: product.name,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl,
      category: product.category,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const Sidebar = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Search</h3>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-ocid="shop.search_input"
        />
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Categories</h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.has(cat)}
                onCheckedChange={() => toggleCategory(cat)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                data-ocid={`shop.${cat}.checkbox`}
              />
              <Label htmlFor={`cat-${cat}`} className="cursor-pointer text-sm">
                {CATEGORY_LABELS[cat]}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Sort By</h3>
        <div className="space-y-2">
          {[
            { value: "default", label: "Default" },
            { value: "price-asc", label: "Price: Low to High" },
            { value: "price-desc", label: "Price: High to Low" },
            { value: "rating", label: "Top Rated" },
          ].map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                id={`sort-${opt.value}`}
                name="sort"
                checked={sortBy === opt.value}
                onChange={() => setSortBy(opt.value as typeof sortBy)}
                className="accent-primary"
              />
              <label
                htmlFor={`sort-${opt.value}`}
                className="text-sm cursor-pointer"
              >
                {opt.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      {(selectedCategories.size > 0 || searchQuery) && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            setSelectedCategories(new Set());
            setSearchQuery("");
            navigate({ to: "/shop" });
          }}
          data-ocid="shop.clear_filters_button"
        >
          <X className="w-3 h-3 mr-1" /> Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Shop All Products</h1>
        <p className="text-muted-foreground">
          {filtered.length} products found
        </p>
      </div>
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside
          className="hidden lg:block w-56 flex-shrink-0"
          data-ocid="shop.filters.panel"
        >
          {Sidebar}
        </aside>
        {/* Mobile filter toggle */}
        <div className="lg:hidden flex flex-col w-full">
          <Button
            variant="outline"
            size="sm"
            className="self-start mb-4"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            data-ocid="shop.filters_toggle_button"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          </Button>
          {mobileFiltersOpen && (
            <div className="mb-4 p-4 bg-white border border-border rounded-xl">
              {Sidebar}
            </div>
          )}
        </div>
        {/* Product Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-20" data-ocid="shop.empty_state">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-lg">No products found</p>
              <p className="text-muted-foreground text-sm mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-border hover:border-primary/40 hover:shadow-card transition-all overflow-hidden group"
                  data-ocid={`shop.product.item.${i + 1}`}
                >
                  <Link
                    to="/shop/$id"
                    params={{ id: product.id }}
                    className="block"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {product.isTrending && (
                        <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          Trending
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
                        {CATEGORY_LABELS[product.category]}
                      </p>
                      <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1.5">
                        <StarRating rating={product.rating} />
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount.toLocaleString()})
                        </span>
                      </div>
                      <p className="font-bold text-lg text-primary mt-2">
                        ${(product.priceCents / 100).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <Button
                      className="w-full rounded-full bg-primary hover:bg-teal-700 text-white"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      data-ocid={`shop.add_to_cart.button.${i + 1}`}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
