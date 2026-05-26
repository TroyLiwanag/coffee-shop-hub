import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { usePos, fmt, DiscountType } from "@/lib/pos-store";
import { Banknote, QrCode, BadgePercent } from "lucide-react";

export const Route = createFileRoute("/_app/payment")({
  component: PaymentScreen,
});

function PaymentScreen() {
  const {
    cart, cartSubtotal, discount, setDiscount, discountAmount,
    vatableSales, vatAmount, vatExemptSales, serviceCharge, cartTotal,
    placeOrder, settings,
  } = usePos();
  const navigate = useNavigate();
  const [method, setMethod] = useState<"Cash" | "QR">("Cash");
  const [cashGiven, setCashGiven] = useState("");
  const [customer, setCustomer] = useState({ name: "", address: "", tin: "" });
  const isExempt = discount.type === "Senior" || discount.type === "PWD";

  if (cart.length === 0) {
    return (
      <div className="p-10">
        <p className="text-muted-foreground">No items in cart. <Link to="/pos" className="text-accent underline">Back to POS</Link></p>
      </div>
    );
  }

  const change = method === "Cash" ? Math.max(0, Number(cashGiven || 0) - cartTotal) : 0;
  const canConfirm = (method === "QR" || Number(cashGiven || 0) >= cartTotal) &&
    (!isExempt || (discount.idNumber && discount.beneficiary));

  const confirm = () => {
    const order = placeOrder(method, customer);
    navigate({ to: "/receipt/$id", params: { id: order.id } });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="font-display text-3xl mb-6">Payment</h1>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-4">
          <div className="bg-card rounded-2xl border p-6">
            <h2 className="font-display text-xl mb-4">Order summary</h2>
            <div className="space-y-2 mb-4">
              {cart.map(i => (
                <div key={i.id} className="flex justify-between text-sm py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{i.qty}× {i.product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.size}, {i.milk} · Batch {i.product.batchNo}
                    </div>
                  </div>
                  <div className="font-medium">{fmt(i.unitPrice * i.qty)}</div>
                </div>
              ))}
            </div>
            <div className="space-y-1 text-sm pt-2 border-t">
              <Row label="Gross Sales" value={fmt(cartSubtotal)} />
              {isExempt ? (
                <>
                  <Row label={`${discount.type} Discount (20%)`} value={`-${fmt(discountAmount)}`} accent />
                  <Row label="VAT Exempt Sales" value={fmt(vatExemptSales)} muted />
                </>
              ) : (
                settings.vatEnabled && (
                  <>
                    <Row label="VATable Sales" value={fmt(vatableSales)} muted />
                    <Row label={`VAT (${settings.vatRate}%)`} value={fmt(vatAmount)} muted />
                  </>
                )
              )}
              {settings.serviceEnabled && <Row label={`Service (${settings.serviceRate}%)`} value={fmt(serviceCharge)} />}
              <div className="flex justify-between pt-2 mt-2 border-t font-display text-xl">
                <span>Total</span><span className="text-primary">{fmt(cartTotal)}</span>
              </div>
            </div>
          </div>

          {/* Customer form (receipt) */}
          <div className="bg-card rounded-2xl border p-6">
            <h2 className="font-display text-lg mb-4">Customer details (for receipt)</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Customer name" value={customer.name} onChange={v => setCustomer({ ...customer, name: v })} placeholder="Walk-in" />
              <Field label="TIN" value={customer.tin} onChange={v => setCustomer({ ...customer, tin: v })} placeholder="Optional" />
              <div className="col-span-2">
                <Field label="Address" value={customer.address} onChange={v => setCustomer({ ...customer, address: v })} placeholder="Optional" />
              </div>
            </div>
          </div>

          {/* Discount */}
          <div className="bg-card rounded-2xl border p-6">
            <div className="flex items-center gap-2 mb-4">
              <BadgePercent className="w-5 h-5 text-accent" />
              <h2 className="font-display text-lg">Discounts (Senior / PWD)</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["None", "Senior", "PWD"] as DiscountType[]).map(d => (
                <button key={d} onClick={() => setDiscount({ ...discount, type: d })}
                        className={`py-2 rounded-lg border text-sm ${
                          discount.type === d ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
                        }`}>{d}</button>
              ))}
            </div>
            {isExempt && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Field label={`${discount.type} ID No. *`} value={discount.idNumber || ""}
                       onChange={v => setDiscount({ ...discount, idNumber: v })} />
                <Field label="Beneficiary name *" value={discount.beneficiary || ""}
                       onChange={v => setDiscount({ ...discount, beneficiary: v })} />
                <p className="col-span-2 text-xs text-muted-foreground">
                  20% discount + VAT exemption per {discount.type === "Senior" ? "RA 9994" : "RA 10754"}.
                </p>
              </div>
            )}
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
                  {[50, 100, 200, 500, 1000].map(n => (
                    <button key={n} onClick={() => setCashGiven(String(n))}
                            className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted">₱{n}</button>
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

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
             className="mt-1 w-full px-3 py-2 rounded-lg border bg-background text-sm" />
    </div>
  );
}

function Row({ label, value, muted, accent }: { label: string; value: string; muted?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${muted ? "text-muted-foreground" : ""} ${accent ? "text-accent font-medium" : ""}`}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
