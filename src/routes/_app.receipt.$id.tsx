import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { usePos, fmt } from "@/lib/pos-store";
import { Printer, Mail, Check } from "lucide-react";

export const Route = createFileRoute("/_app/receipt/$id")({
  component: ReceiptScreen,
});

function ReceiptScreen() {
  const { id } = Route.useParams();
  const { orders, settings, user } = usePos();
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

  const canPrint = user?.canExport || user?.role === "admin";
  const orNo = String(order.number).padStart(7, "0");
  const isExempt = order.discount.type === "Senior" || order.discount.type === "PWD";

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center">
          <Check className="w-6 h-6 text-success" />
        </div>
        <div>
          <h1 className="font-display text-3xl">Payment successful</h1>
          <p className="text-muted-foreground text-sm">Official Receipt #{orNo}</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border p-8 shadow-sm" id="printable-receipt">
        <div className="text-center pb-5 border-b border-dashed">
          <h2 className="font-display text-2xl">{settings.shopName}</h2>
          <p className="text-xs text-muted-foreground mt-1">{settings.businessStyle}</p>
          <p className="text-xs text-muted-foreground">{settings.address}</p>
          <p className="text-xs text-muted-foreground">Tel: {settings.phone}</p>
          <p className="text-xs text-muted-foreground">VAT REG TIN: {settings.tin}</p>
          <p className="font-display text-base mt-3 tracking-wider">OFFICIAL RECEIPT</p>
        </div>

        {/* Customer details form-style */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs py-3 border-b border-dashed">
          <FormLine label="OR No." value={orNo} />
          <FormLine label="Date" value={new Date(order.createdAt).toLocaleString()} />
          <FormLine label="Sold to" value={order.customerName || "Walk-in Customer"} />
          <FormLine label="Cashier" value={order.cashier} />
          <FormLine label="Address" value={order.customerAddress || "—"} />
          <FormLine label="TIN" value={order.customerTin || "—"} />
          <FormLine label="Payment" value={order.method} />
          {isExempt && (
            <FormLine label={`${order.discount.type} ID`} value={order.discount.idNumber || "—"} />
          )}
          {isExempt && order.discount.beneficiary && (
            <FormLine label="Beneficiary" value={order.discount.beneficiary} />
          )}
        </div>

        <table className="w-full text-sm py-4">
          <thead>
            <tr className="text-xs uppercase text-muted-foreground border-b">
              <th className="text-left py-2">Qty</th>
              <th className="text-left py-2">Description</th>
              <th className="text-left py-2">Batch</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(i => (
              <tr key={i.id} className="border-b border-dashed align-top">
                <td className="py-2">{i.qty}</td>
                <td className="py-2">
                  <div>{i.product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {i.size} · {i.sugar} · {i.milk}{i.addons.length ? ` + ${i.addons.join(", ")}` : ""}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Unit: {i.product.unit}</div>
                </td>
                <td className="py-2 text-xs font-mono">{i.product.batchNo}</td>
                <td className="py-2 text-right">{fmt(i.unitPrice)}</td>
                <td className="py-2 text-right">{fmt(i.unitPrice * i.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-dashed pt-3 space-y-1 text-sm">
          <Row label="Gross Sales" value={fmt(order.subtotal)} />
          {isExempt ? (
            <>
              <Row label={`Less: ${order.discount.type} Discount (20%)`} value={`-${fmt(order.discountAmount)}`} />
              <Row label="VAT Exempt Sales" value={fmt(order.vatExemptSales)} />
              <Row label="VAT Amount" value={fmt(0)} muted />
            </>
          ) : (
            settings.vatEnabled && (
              <>
                <Row label="VATable Sales" value={fmt(order.vatableSales)} muted />
                <Row label={`VAT (${settings.vatRate}%)`} value={fmt(order.vatAmount)} muted />
              </>
            )
          )}
          {settings.serviceEnabled && order.serviceCharge > 0 && (
            <Row label={`Service Charge (${settings.serviceRate}%)`} value={fmt(order.serviceCharge)} />
          )}
          <div className="flex justify-between pt-2 mt-2 border-t font-display text-xl">
            <span>TOTAL DUE</span><span>{fmt(order.total)}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-dashed text-[10px] text-muted-foreground leading-relaxed">
          <p className="font-semibold uppercase mb-1">Legal Basis</p>
          <p>• VAT pursuant to Sec. 106 & 108 of NIRC of 1997, as amended by RA 10963 (TRAIN Law).</p>
          <p>• Senior Citizen 20% discount & VAT exemption: RA 9994 (Expanded Senior Citizens Act).</p>
          <p>• Person With Disability 20% discount & VAT exemption: RA 10754 (Magna Carta for PWDs).</p>
          <p className="mt-1">This Official Receipt shall be valid for five (5) years from the date of ATP.</p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5 pt-4 border-t border-dashed">
          {settings.receiptFooter}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <button onClick={() => canPrint ? window.print() : alert("Only authorized personnel can print receipts.")}
                className={`py-3 rounded-lg border flex items-center justify-center gap-2 text-sm ${
                  canPrint ? "bg-card hover:bg-muted" : "bg-muted/40 opacity-60 cursor-not-allowed"
                }`}>
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

function FormLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground min-w-[80px]">{label}:</span>
      <span className="font-medium border-b border-dotted flex-1">{value}</span>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex justify-between ${muted ? "text-muted-foreground" : ""}`}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
