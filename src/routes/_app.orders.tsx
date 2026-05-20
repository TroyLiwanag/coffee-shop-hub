import { createFileRoute, Link } from "@tanstack/react-router";
import { usePos, fmt } from "@/lib/pos-store";

export const Route = createFileRoute("/_app/orders")({
  component: OrdersScreen,
});

function OrdersScreen() {
  const { orders } = usePos();
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl mb-6">Recent Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-card rounded-2xl border p-12 text-center text-muted-foreground">
          No orders yet today.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <Link key={o.id} to="/receipt/$id" params={{ id: o.id }}
                  className="block bg-card rounded-xl border p-5 hover:border-accent transition">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-display text-lg">Order #{o.number}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()} · {o.cashier} · {o.method}</div>
                  <div className="text-sm mt-2 text-muted-foreground">
                    {o.items.map(i => `${i.qty}× ${i.product.name}`).join(", ")}
                  </div>
                </div>
                <div className="font-display text-xl text-primary">{fmt(o.total)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
