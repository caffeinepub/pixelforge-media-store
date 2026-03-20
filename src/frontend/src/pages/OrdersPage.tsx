import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Package } from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus } from "../backend";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.pending]: "bg-yellow-100 text-yellow-700",
  [OrderStatus.paid]: "bg-blue-100 text-blue-700",
  [OrderStatus.shipped]: "bg-purple-100 text-purple-700",
  [OrderStatus.delivered]: "bg-green-100 text-green-700",
};

export default function OrdersPage() {
  const { actor, isFetching } = useActor();
  const { identity, login } = useInternetIdentity();
  const isLoggedIn = identity && !identity.getPrincipal().isAnonymous();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["userOrders"],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserOrders(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!isLoggedIn,
  });

  if (!isLoggedIn) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-24 text-center"
        data-ocid="orders.login_prompt"
      >
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Sign in to view orders</h1>
        <p className="text-muted-foreground mb-8">
          Your order history will appear here after signing in.
        </p>
        <Button
          onClick={login}
          size="lg"
          className="rounded-full bg-primary hover:bg-teal-700"
          data-ocid="orders.login_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {isLoading ? (
        <div className="space-y-4" data-ocid="orders.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-border rounded-2xl p-5"
              data-ocid={`orders.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(0, 16)}...
                  </p>
                  <p className="font-semibold mt-1">
                    {order.items.length} item(s)
                  </p>
                </div>
                <Badge
                  className={`${
                    STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"
                  } border-0`}
                >
                  {order.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20" data-ocid="orders.empty_state">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-8">
            Start shopping to see your orders here.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary hover:bg-teal-700"
            data-ocid="orders.shop_now_button"
          >
            <Link to="/shop">
              Shop Now <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
