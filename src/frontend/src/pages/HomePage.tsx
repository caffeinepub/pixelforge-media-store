import { Link } from "@tanstack/react-router";
import { ArrowRight, Headphones, Shield, Star, Truck } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  type ProductCategory,
  SAMPLE_PRODUCTS,
} from "../data/sampleProducts";

const CATEGORIES: ProductCategory[] = [
  "personalCare",
  "electronics",
  "homeGoods",
];

const CATEGORY_IMAGES: Record<ProductCategory, string> = {
  personalCare: "https://picsum.photos/seed/personalcare/400/300",
  electronics: "https://picsum.photos/seed/electronics/400/300",
  homeGoods: "https://picsum.photos/seed/homegoods/400/300",
};

const TRUST_BADGES = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: Shield, title: "Secure Payments", desc: "256-bit SSL encryption" },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "We're always here for you",
  },
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

export default function HomePage() {
  const trendingProducts = SAMPLE_PRODUCTS.filter((p) => p.isTrending).slice(
    0,
    6,
  );

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-white"
        style={{ minHeight: "520px" }}
      >
        <div
          className="flex flex-col md:flex-row"
          style={{ minHeight: "520px" }}
        >
          {/* Left teal panel with diagonal edge */}
          <div
            className="hero-teal-panel flex-1 flex flex-col justify-center px-8 md:px-16 py-16 md:py-0"
            style={{ backgroundColor: "oklch(var(--primary))" }}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-4">
                Daily Essentials &amp; Trending Picks
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Shop What
                <br />
                Matters Most
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-md">
                Personal care, electronics, and home goods — everything you
                need, curated and ready to deliver.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent hover:bg-orange-600 text-white border-0 px-8 rounded-full"
                  data-ocid="hero.shop_now_button"
                >
                  <Link to="/shop">
                    Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary rounded-full"
                  data-ocid="hero.view_categories_button"
                >
                  <Link to="/shop">Browse Categories</Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right hero image */}
          <div className="flex-1 relative">
            <img
              src="/assets/generated/hero-personal-care.dim_900x600.jpg"
              alt="Personal care products"
              className="w-full h-full object-cover"
              style={{ minHeight: "300px", maxHeight: "520px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="absolute bottom-8 right-8 bg-white rounded-2xl p-4 shadow-xl"
            >
              <p className="text-xs text-muted-foreground">
                Top-rated this week
              </p>
              <p className="font-bold text-foreground">Sony WF-1000XM5</p>
              <div className="flex items-center gap-1 mt-1">
                <StarRating rating={4.9} />
                <span className="text-xs text-muted-foreground">4.9</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TRUST_BADGES.map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <b.icon className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Shop by Category
          </h2>
          <p className="text-muted-foreground">Find exactly what you need</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to="/shop"
                search={{ category: cat }}
                className="group block rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-card transition-all bg-teal-50"
                data-ocid={`home.category.item.${i + 1}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={CATEGORY_IMAGES[cat]}
                    alt={CATEGORY_LABELS[cat]}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl mb-1">{CATEGORY_ICONS[cat]}</p>
                      <h3 className="font-bold text-lg text-foreground">
                        {CATEGORY_LABELS[cat]}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {CATEGORY_DESCRIPTIONS[cat]}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-primary font-semibold text-sm">
                    Explore{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending This Week */}
      <section className="bg-muted/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Trending This Week
            </h2>
            <p className="text-muted-foreground">
              Most loved by our customers right now
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to="/shop/$id"
                  params={{ id: product.id }}
                  className="group block bg-white rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-card transition-all"
                  data-ocid={`home.trending.item.${i + 1}`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full">
                        🔥 Trending
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
                      {CATEGORY_LABELS[product.category]}
                    </p>
                    <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <StarRating rating={product.rating} />
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount.toLocaleString()})
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-lg text-primary">
                        ${(product.priceCents / 100).toFixed(2)}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        Add to Cart
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
              data-ocid="home.view_all_button"
            >
              <Link to="/shop">
                View All Products <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">What Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              name: "Priya M.",
              text: "PixelKart has the best selection of skincare products. Fast delivery and great prices!",
              rating: 5,
            },
            {
              name: "Jake T.",
              text: "Got the Sony earbuds at an amazing price. The checkout experience was super smooth.",
              rating: 5,
            },
            {
              name: "Aisha K.",
              text: "Love the home goods section. The knife set is incredible quality for the price.",
              rating: 5,
            },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-teal-50 rounded-2xl p-6 border border-border"
            >
              <StarRating rating={t.rating} />
              <p className="mt-3 text-sm text-foreground italic">
                &#8220;{t.text}&#8221;
              </p>
              <p className="mt-3 font-semibold text-sm">— {t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
