import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Settings, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Color, ExternalBlob, OrderStatus, Size } from "../backend";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AdminPage() {
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const qc = useQueryClient();
  const isLoggedIn = identity && !identity.getPrincipal().isAnonymous();
  const claimAttempted = useRef(false);
  const [claiming, setClaiming] = useState(false);
  const [claimDenied, setClaimDenied] = useState(false);

  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => actor!.isCallerAdmin(),
    enabled: !!actor && !!isLoggedIn,
  });

  // When isAdmin comes back false, attempt to claim admin if no admin exists
  useEffect(() => {
    if (!actor || !isLoggedIn || isAdmin !== false || claimAttempted.current)
      return;
    claimAttempted.current = true;

    const claim = async () => {
      setClaiming(true);
      try {
        const granted: boolean = await (actor as any).claimAdminIfNone();
        if (granted) {
          qc.invalidateQueries({ queryKey: ["isAdmin"] });
        } else {
          setClaimDenied(true);
        }
      } catch {
        setClaimDenied(true);
      } finally {
        setClaiming(false);
      }
    };

    claim();
  }, [actor, isLoggedIn, isAdmin, qc]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
        <p className="text-muted-foreground mb-6">
          Sign in to access the admin dashboard.
        </p>
        <Button
          onClick={login}
          className="rounded-full bg-primary hover:bg-teal-700"
          data-ocid="admin.login_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (checkingAdmin || claiming) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-32 flex flex-col items-center gap-4"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">
          {claiming ? "Setting up admin access..." : "Checking permissions..."}
        </p>
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  if (claimDenied || (!isAdmin && !claiming)) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-32 text-center"
        data-ocid="admin.error_state"
      >
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have admin privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" /> PixelKart Admin
      </h1>
      <Tabs defaultValue="products">
        <TabsList className="mb-8 bg-muted">
          <TabsTrigger value="products" data-ocid="admin.products.tab">
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" data-ocid="admin.orders.tab">
            Orders
          </TabsTrigger>
          <TabsTrigger value="stripe" data-ocid="admin.stripe.tab">
            Stripe
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTab actor={actor} qc={qc} />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTab actor={actor} qc={qc} />
        </TabsContent>
        <TabsContent value="stripe">
          <StripeTab actor={actor} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductsTab({ actor, qc }: { actor: any; qc: any }) {
  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => actor.listProducts(),
    enabled: !!actor,
  });
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = async () => {
    if (!name || !price) return;
    try {
      await actor.createProduct({
        id: crypto.randomUUID(),
        name,
        description,
        priceCents: BigInt(Math.round(Number.parseFloat(price) * 100)),
        availableSizes: [Size.s, Size.m, Size.l, Size.xl],
        availableColors: [Color.black, Color.white],
        image: ExternalBlob.fromURL(
          "https://picsum.photos/seed/product/400/400",
        ),
      });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product added!");
      setShowForm(false);
      setName("");
      setDescription("");
      setPrice("");
    } catch {
      toast.error("Failed to add product.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await actor.deleteProduct(id);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Products ({products?.length ?? 0})
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-primary hover:bg-teal-700"
          data-ocid="admin.add_product_button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Product
        </Button>
      </div>
      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold">New Product</h3>
            <div>
              <Label htmlFor="pname" className="mb-1 block">
                Name
              </Label>
              <Input
                id="pname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                data-ocid="admin.product_name.input"
              />
            </div>
            <div>
              <Label htmlFor="pdesc" className="mb-1 block">
                Description
              </Label>
              <Textarea
                id="pdesc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                data-ocid="admin.product_desc.textarea"
              />
            </div>
            <div>
              <Label htmlFor="pprice" className="mb-1 block">
                Price (USD)
              </Label>
              <Input
                id="pprice"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29.99"
                data-ocid="admin.product_price.input"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAdd}
                className="bg-primary hover:bg-teal-700"
                data-ocid="admin.save_product_button"
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                data-ocid="admin.cancel_product_button"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {isLoading ? (
        <Skeleton className="h-32" data-ocid="admin.products.loading_state" />
      ) : (
        <div className="space-y-3">
          {products?.map((p: any, i: number) => (
            <Card key={p.id} data-ocid={`admin.product.item.${i + 1}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${(Number(p.priceCents) / 100).toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(p.id)}
                  data-ocid={`admin.product.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {(!products || products.length === 0) && (
            <p
              className="text-muted-foreground text-sm text-center py-8"
              data-ocid="admin.products.empty_state"
            >
              No products added yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function OrdersTab({ actor, qc }: { actor: any; qc: any }) {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => actor.getAllOrders(),
    enabled: !!actor,
  });

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await actor.updateOrderStatus(id, status);
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order updated.");
    } catch {
      toast.error("Failed to update.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">All Orders ({orders?.length ?? 0})</h2>
      {isLoading ? (
        <Skeleton className="h-32" data-ocid="admin.orders.loading_state" />
      ) : (
        <div className="space-y-3">
          {orders?.map((order: any, i: number) => (
            <Card key={order.id} data-ocid={`admin.order.item.${i + 1}`}>
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(0, 14)}...
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.items?.length ?? 0} item(s)
                  </p>
                </div>
                <Select
                  defaultValue={order.status}
                  onValueChange={(v) =>
                    updateStatus(order.id, v as OrderStatus)
                  }
                >
                  <SelectTrigger
                    className="w-36"
                    data-ocid={`admin.order.status.select.${i + 1}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OrderStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
          {(!orders || orders.length === 0) && (
            <p
              className="text-muted-foreground text-sm text-center py-8"
              data-ocid="admin.orders.empty_state"
            >
              No orders yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StripeTab({ actor }: { actor: any }) {
  const { data: configured } = useQuery({
    queryKey: ["stripe-configured"],
    queryFn: () => actor.isStripeConfigured(),
    enabled: !!actor,
  });
  const [secretKey, setSecretKey] = useState("");
  const [countries, setCountries] = useState("US,CA,GB,AU,IN");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await actor.setStripeConfiguration({
        secretKey,
        allowedCountries: countries.split(",").map((c: string) => c.trim()),
      });
      toast.success("Stripe configured successfully!");
      setSecretKey("");
    } catch {
      toast.error("Failed to save Stripe configuration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold">Stripe Configuration</h2>
        <Badge variant={configured ? "default" : "secondary"}>
          {configured ? "✓ Configured" : "Not configured"}
        </Badge>
      </div>
      {configured && (
        <p className="text-sm text-green-600">
          Stripe is active. You can update the configuration below.
        </p>
      )}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="sk" className="mb-1.5 block">
              Stripe Secret Key
            </Label>
            <Input
              id="sk"
              type="password"
              placeholder="sk_live_..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              data-ocid="admin.stripe_key.input"
            />
          </div>
          <div>
            <Label htmlFor="countries" className="mb-1.5 block">
              Allowed Countries
            </Label>
            <Input
              id="countries"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              placeholder="US,CA,GB"
              data-ocid="admin.stripe_countries.input"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Comma-separated ISO country codes
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving || !secretKey}
            className="bg-primary hover:bg-teal-700 rounded-full"
            data-ocid="admin.stripe_save_button"
          >
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
