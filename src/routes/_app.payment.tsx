import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { usePos, fmt } from "@/lib/pos-store";
import { Banknote, QrCode, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_app/payment")({
  component: PaymentScreen,
});

function PaymentScreen() {
  const { cart, cartSubtotal, cartTax, cartService, cartTotal, placeOrder, settings } = usePos();
  const navigate = useNavigate();
  const [method, setMethod] = useState<"Cash" | "QR">("Cash");
  const [cashGiven, setCashGiven] = useState("");

  if (cart.length === 0) {
    return (
      <div className="p-10">
        <p className="text-muted-foreground">No items in cart. <Link to="/pos" className="text-accent underline">Back to POS</Link></p>
      </div>
    );
  }

  const change = method === "Cash" ? Math.max(0, Number(cashGiven || 0) - cartTotal) : 0;
  const canConfirm = method === "QR" || Number(cashGiven || 0) >= cartTotal;

  const confirm = () => {
    const order = placeOrder(method);
    navigate({ to: "/receipt/$id", params: { id: order.id } });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button onClick={() => navigate({ to: "/pos" })} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to POS
      </button>
      <h1 className="font-display text-3xl mb-6">Payment</h1>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 bg-card rounded-2xl border p-6">
          <h2 className="font-display text-xl mb-4">Order summary</h2>
          <div className="space-y-2 mb-4">
            {cart.map(i => (
              <div key={i.id} className="flex justify-between text-sm py-2 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{i.qty}× {i.product.name}</div>
                  <div className="text-xs text-muted-foreground">{i.size}, {i.milk}</div>
                </div>
                <div className="font-medium">{fmt(i.unitPrice * i.qty)}</div>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-sm pt-2 border-t">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(cartSubtotal)}</span></div>
            {settings.taxEnabled && <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{fmt(cartTax)}</span></div>}
            {settings.serviceEnabled && <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span>{fmt(cartService)}</span></div>}
            <div className="flex justify-between pt-2 mt-2 border-t font-display text-xl">
              <span>Total</span><span className="text-primary">{fmt(cartTotal)}</span>
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="bg-card rounded-2xl border p-6">
            <h2 className="font-display text-xl mb-4">Payment method</h2>
            <div className="grid grid-cols-2 gap-3">
              <MethodCard active={method === "Cash"} onClick={() => setMethod("Cash")} icon={<Banknote className="w-6 h-6" />} label="Cash" />
              <MethodCard active={method === "QR"} onClick={() => setMethod("QR")} icon={<QrCode className="w-6 h-6" />} label="QR Payment" />
            </div>

            {method === "Cash" && (
              <div className="mt-5 space-y-3">
                <label className="text-sm font-medium">Cash received</label>
                <input value={cashGiven} onChange={e => setCashGiven(e.target.value)} type="number" placeholder="0.00"
                       className="w-full px-4 py-3 rounded-lg border bg-background text-lg" />
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 20, 50, 100].map(n => (
                    <button key={n} onClick={() => setCashGiven(String(n))}
                            className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted">${n}</button>
                  ))}
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-muted-foreground">Change</span>
                  <span className="font-semibold text-accent">{fmt(change)}</span>
                </div>
              </div>
            )}

            {method === "QR" && (
              <div className="mt-5 flex flex-col items-center py-4">
                <div className="w-44 h-44 bg-foreground rounded-xl grid grid-cols-8 grid-rows-8 gap-0.5 p-3">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.45 ? "bg-background" : ""}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">Scan with your banking app</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate({ to: "/pos" })}
                    className="flex-1 py-3 rounded-lg border bg-card hover:bg-muted">Cancel</button>
            <button onClick={confirm} disabled={!canConfirm}
                    className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-40 hover:opacity-90">
              Confirm payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MethodCard({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick}
            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${
              active ? "border-accent bg-accent/10" : "border-border hover:bg-muted"
            }`}>
      {icon}<span className="text-sm font-medium">{label}</span>
    </button>
  );
}
