import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Shield, ShoppingCart, Star, Truck } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { CATEGORY_LABELS, SAMPLE_PRODUCTS } from "../data/sampleProducts";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/shop/$id" });
  const { addItem } = useCart();

  const product = SAMPLE_PRODUCTS.find((p) => p.id === id);
  const related = SAMPLE_PRODUCTS.filter(
    (p) => p.category === product?.category && p.id !== id,
  ).slice(0, 3);

  if (!product) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-24 text-center"
        data-ocid="product.error_state"
      >
        <p className="text-5xl mb-4">😕</p>
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This product doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl,
      category: product.category,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        data-ocid="product.back_link"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="rounded-2xl overflow-hidden border border-border bg-muted/10">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col"
        >
          <div className="mb-2">
            <Link
              to="/shop"
              search={{ category: product.category }}
              className="text-primary text-sm font-medium hover:underline"
            >
              {CATEGORY_LABELS[product.category]}
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating} />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted-foreground text-sm">
              ({product.reviewCount.toLocaleString()} reviews)
            </span>
          </div>
          <p className="text-4xl font-extrabold text-primary mb-6">
            ${(product.priceCents / 100).toFixed(2)}
          </p>
          <p className="text-foreground/80 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-6">
            {product.isTrending && (
              <Badge className="bg-accent text-white">🔥 Trending</Badge>
            )}
            {product.isFeatured && (
              <Badge variant="outline" className="border-primary text-primary">
                ⭐ Featured
              </Badge>
            )}
            <Badge variant="outline" className="text-muted-foreground">
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
            </Badge>
          </div>

          <div className="flex gap-3 mb-6">
            <Button
              size="lg"
              className="flex-1 rounded-full bg-primary hover:bg-teal-700"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              data-ocid="product.add_to_cart_button"
            >
              <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
              data-ocid="product.buy_now_button"
            >
              <Link to="/cart">Buy Now</Link>
            </Button>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>30-day hassle-free returns</span>
            </div>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">
            More in {CATEGORY_LABELS[product.category]}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((rp, i) => (
              <Link
                key={rp.id}
                to="/shop/$id"
                params={{ id: rp.id }}
                className="group block bg-white rounded-2xl border border-border hover:border-primary/40 hover:shadow-card transition-all overflow-hidden"
                data-ocid={`product.related.item.${i + 1}`}
              >
                <img
                  src={rp.imageUrl}
                  alt={rp.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {rp.name}
                  </h3>
                  <p className="font-bold text-primary mt-1">
                    ${(rp.priceCents / 100).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
