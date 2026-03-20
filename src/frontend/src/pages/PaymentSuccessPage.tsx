import { Link } from "@tanstack/react-router";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";

export default function PaymentSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div
      className="max-w-xl mx-auto px-4 py-24 text-center"
      data-ocid="payment.success.panel"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. We'll start processing your order right
          away. You'll receive a confirmation email shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary hover:bg-teal-700"
            data-ocid="payment.success.orders_button"
          >
            <Link to="/orders">
              <ShoppingBag className="mr-2 w-4 h-4" /> View Orders
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
            data-ocid="payment.success.shop_button"
          >
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
