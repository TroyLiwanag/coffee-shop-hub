import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { usePos, fmt } from "@/lib/pos-store";
import { Printer, Mail, Check } from "lucide-react";

export const Route = createFileRoute("/_app/receipt/$id")({
  component: ReceiptScreen,
});

function ReceiptScreen() {
  const { id } = Route.useParams();
  const { orders, settings } = usePos();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === id);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  if (!order) {
    return (
      <div className="p-10">
        <p className="text-muted-foreground">Order not found. <Link to="/pos" className="text-accent underline">Back to POS</Link></p>
      </div>
    );
  }

  const subtotal = order.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center">
          <Check className="w-6 h-6 text-success" />
        </div>
        <div>
          <h1 className="font-display text-3xl">Payment successful</h1>
          <p className="text-muted-foreground text-sm">Order #{order.number}</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border p-8 shadow-sm">
        <div className="text-center pb-5 border-b border-dashed">
          <h2 className="font-display text-2xl">{settings.shopName}</h2>
          <p className="text-xs text-muted-foreground mt-1">{settings.address}</p>
          <p className="text-xs text-muted-foreground">{settings.phone}</p>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground py-3">
          <span>Order #{order.number}</span>
          <span>{new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div className="text-xs text-muted-foreground pb-3 border-b border-dashed">Cashier: {order.cashier} · {order.method}</div>

        <div className="py-4 space-y-2">
          {order.items.map(i => (
            <div key={i.id} className="flex justify-between text-sm">
              <div>
                <div>{i.qty}× {i.product.name}</div>
                <div className="text-xs text-muted-foreground">{i.size}, {i.sugar}, {i.milk}{i.addons.length ? ` + ${i.addons.join(", ")}` : ""}</div>
              </div>
              <div>{fmt(i.unitPrice * i.qty)}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(subtotal)}</span></div>
          {settings.taxEnabled && (
            <div className="flex justify-between"><span className="text-muted-foreground">Tax {settings.taxRate}%</span><span>{fmt(subtotal * settings.taxRate / 100)}</span></div>
          )}
          {settings.serviceEnabled && (
            <div className="flex justify-between"><span className="text-muted-foreground">Service {settings.serviceRate}%</span><span>{fmt(subtotal * settings.serviceRate / 100)}</span></div>
          )}
          <div className="flex justify-between pt-2 mt-2 border-t font-display text-xl">
            <span>Total</span><span>{fmt(order.total)}</span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 pt-5 border-t border-dashed">
          {settings.receiptFooter}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <button onClick={() => window.print()} className="py-3 rounded-lg bg-card border hover:bg-muted flex items-center justify-center gap-2 text-sm">
          <Printer className="w-4 h-4" /> Print receipt
        </button>
        <div className="col-span-1 relative">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
                 className="w-full h-full px-3 rounded-lg border bg-background text-sm" />
        </div>
        <button onClick={() => email && setEmailSent(true)}
                disabled={!email || emailSent}
                className="py-3 rounded-lg bg-card border hover:bg-muted flex items-center justify-center gap-2 text-sm disabled:opacity-50">
          <Mail className="w-4 h-4" /> {emailSent ? "Sent ✓" : "Send digital"}
        </button>
      </div>

      <button onClick={() => navigate({ to: "/pos" })}
              className="w-full mt-3 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">
        New order
      </button>
    </div>
  );
}
