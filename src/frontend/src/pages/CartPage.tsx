import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ShoppingItem } from "../backend";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";
import { useCreateCheckoutSession } from "../hooks/useCheckout";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalCents } =
    useCart();
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const checkout = useCreateCheckoutSession();
  const [verifying, setVerifying] = useState(false);

  const isLoggedIn = identity && !identity.getPrincipal().isAnonymous();

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to checkout.");
      login();
      return;
    }
    if (!actor) {
      toast.error("Not connected. Please try again.");
      return;
    }
    setVerifying(true);
    try {
      const configured = await actor.isStripeConfigured();
      if (!configured) {
        toast.error(
          "Payments are not configured yet. Please contact the admin.",
        );
        return;
      }
    } catch {
      toast.error("Could not verify payment configuration.");
      return;
    } finally {
      setVerifying(false);
    }

    const shoppingItems: ShoppingItem[] = items.map((item) => ({
      productName: item.productName,
      productDescription: item.category,
      currency: "usd",
      priceInCents: BigInt(item.priceCents),
      quantity: BigInt(item.quantity),
    }));

    try {
      const session = await checkout.mutateAsync(shoppingItems);
      window.location.href = session.url;
    } catch (err) {
      toast.error("Failed to start checkout. Please try again.");
      console.error(err);
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-24 text-center"
        data-ocid="cart.empty_state"
      >
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-full bg-primary hover:bg-teal-700"
          data-ocid="cart.shop_now_button"
        >
          <Link to="/shop">
            Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const subtotal = totalCents;
  const shipping = subtotal >= 5000 ? 0 : 499;
  const total = subtotal + shipping;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4" data-ocid="cart.items.list">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-border rounded-2xl p-4 flex gap-4"
                data-ocid={`cart.item.${i + 1}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">
                    {item.category.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="font-bold text-primary mt-1">
                    ${(item.priceCents / 100).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-border rounded-full overflow-hidden">
                      <button
                        type="button"
                        className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        data-ocid={`cart.decrease_qty.button.${i + 1}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-sm font-medium min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        data-ocid={`cart.increase_qty.button.${i + 1}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      data-ocid={`cart.remove.button.${i + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            data-ocid="cart.clear_cart_button"
          >
            Clear cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div
            className="bg-white border border-border rounded-2xl p-6 sticky top-24"
            data-ocid="cart.order_summary.panel"
          >
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-primary font-medium">Free</span>
                  ) : (
                    `$${(shipping / 100).toFixed(2)}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders over $50
                </p>
              )}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-base mb-6">
              <span>Total</span>
              <span className="text-primary text-lg">
                ${(total / 100).toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full rounded-full bg-primary hover:bg-teal-700 text-white h-12"
              onClick={handleCheckout}
              disabled={checkout.isPending || verifying}
              data-ocid="cart.checkout_button"
            >
              {checkout.isPending || verifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Secured by Stripe · SSL encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
