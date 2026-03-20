import { Link } from "@tanstack/react-router";
import { RefreshCw, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";

export default function PaymentFailurePage() {
  return (
    <div
      className="max-w-xl mx-auto px-4 py-24 text-center"
      data-ocid="payment.failure.panel"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <XCircle className="w-20 h-20 text-destructive mx-auto mb-6" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-3">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-8">
          Your payment was not completed. Your cart is still saved — try again
          when you're ready.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-accent hover:bg-orange-600 text-white"
            data-ocid="payment.failure.retry_button"
          >
            <Link to="/cart">
              <RefreshCw className="mr-2 w-4 h-4" /> Try Again
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full"
            data-ocid="payment.failure.shop_button"
          >
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
