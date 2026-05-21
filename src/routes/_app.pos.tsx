import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { usePos, PRODUCTS, Product, CartItem, fmt } from "@/lib/pos-store";
import { Plus, Minus, Trash2, ShoppingCart, X } from "lucide-react";

export const Route = createFileRoute("/_app/pos")({
  component: PosScreen,
});

const CATEGORIES = ["Coffee", "Non-Coffee", "Iced Blended", "Snacks", "Rice Meals"] as const;
const SIZES = [{ name: "Medium", add: 0 }, { name: "Large", add: 20 }];
const SUGAR = ["No sugar", "Less", "Normal", "Extra"];
const MILK = ["Whole", "Oat (+₱10)", "Almond (+₱10)", "None"];
const ADDONS = [
  { name: "Extra shot", price: 20 },
  { name: "Whipped cream", price: 15 },
  { name: "Vanilla syrup", price: 10 },
  { name: "Caramel drizzle", price: 10 },
];

function PosScreen() {
  const { user, cart, addToCart, removeFromCart, updateQty, cartSubtotal, cartTax, cartService, cartTotal, settings } = usePos();
  const navigate = useNavigate();
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("Coffee");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const products = useMemo(() => PRODUCTS.filter(p => p.category === category), [category]);
  const date = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <header className="px-8 py-5 bg-card border-b flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{date}</div>
            <h1 className="font-display text-2xl mt-0.5">Good day, {user?.name.split(" ")[0]}</h1>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Station</div>
            <div className="font-medium">Counter #1</div>
          </div>
        </header>

        <div className="px-8 pt-6 pb-2 flex gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                      category === c ? "bg-primary text-primary-foreground" : "bg-card border hover:bg-muted"
                    }`}>
              {c}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto px-8 py-4">
          <div className="grid grid-cols-3 gap-4">
            {products.map(p => (
              <button key={p.id} onClick={() => setModalProduct(p)}
                      className="group bg-card rounded-2xl p-5 border hover:border-accent hover:shadow-md transition text-left">
                <div className="aspect-square rounded-xl flex items-center justify-center text-6xl mb-3"
                     style={{ background: "var(--cream)" }}>
                  {p.emoji}
                </div>
                <div className="font-medium text-foreground">{p.name}</div>
                <div className="text-sm text-accent font-semibold mt-1">{fmt(p.price)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart */}
      <aside className="w-96 bg-card border-l flex flex-col">
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl">Current Order</h2>
          </div>
          <span className="text-xs bg-muted px-2 py-1 rounded-full">{cart.length} items</span>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          {cart.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-12">
              Cart is empty. Tap a product to start.
            </div>
          )}
          {cart.map(item => (
            <div key={item.id} className="bg-background rounded-lg p-3 border">
              <div className="flex justify-between gap-2">
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.product.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {item.size} · {item.sugar} · {item.milk}
                  </div>
                  {item.addons.length > 0 && (
                    <div className="text-xs text-muted-foreground">+ {item.addons.join(", ")}</div>
                  )}
                  {item.notes && <div className="text-xs italic text-muted-foreground mt-1">"{item.notes}"</div>}
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-muted hover:bg-border flex items-center justify-center">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-muted hover:bg-border flex items-center justify-center">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="font-semibold text-sm">{fmt(item.unitPrice * item.qty)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-5 space-y-2 bg-background">
          <Row label="Subtotal" value={fmt(cartSubtotal)} />
          {settings.taxEnabled && <Row label={`Tax (${settings.taxRate}%)`} value={fmt(cartTax)} />}
          {settings.serviceEnabled && <Row label={`Service (${settings.serviceRate}%)`} value={fmt(cartService)} />}
          <div className="flex justify-between pt-2 border-t">
            <span className="font-display text-lg">Total</span>
            <span className="font-display text-xl text-primary">{fmt(cartTotal)}</span>
          </div>
          <button disabled={cart.length === 0}
                  onClick={() => navigate({ to: "/payment" })}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-40 hover:opacity-90">
            Proceed to Pay
          </button>
        </div>
      </aside>

      {modalProduct && (
        <CustomizeModal product={modalProduct} onClose={() => setModalProduct(null)} onAdd={addToCart} />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function CustomizeModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (i: CartItem) => void }) {
  const [size, setSize] = useState(SIZES[1].name);
  const [sugar, setSugar] = useState(SUGAR[2]);
  const [milk, setMilk] = useState(MILK[0]);
  const [addons, setAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const sizeAdd = SIZES.find(s => s.name === size)?.add ?? 0;
  const milkAdd = milk.includes("+₱10") ? 10 : 0;
  const addonsTotal = ADDONS.filter(a => addons.includes(a.name)).reduce((s, a) => s + a.price, 0);
  const unitPrice = product.price + sizeAdd + milkAdd + addonsTotal;

  const toggle = (name: string) => setAddons(a => a.includes(name) ? a.filter(x => x !== name) : [...a, name]);

  const submit = () => {
    onAdd({
      id: crypto.randomUUID(), product, qty: 1, size, sugar, milk,
      addons, notes, unitPrice,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto shadow-2xl">
        <div className="sticky top-0 bg-card px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-3xl" style={{ background: "var(--cream)" }}>
              {product.emoji}
            </div>
            <div>
              <h3 className="font-display text-xl">{product.name}</h3>
              <div className="text-sm text-muted-foreground">{fmt(product.price)} base</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          <Section label="Size">
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map(s => (
                <Pill key={s.name} active={size === s.name} onClick={() => setSize(s.name)}>
                  {s.name}{s.add ? ` +${fmt(s.add)}` : ""}
                </Pill>
              ))}
            </div>
          </Section>

          <Section label="Sugar">
            <div className="grid grid-cols-4 gap-2">
              {SUGAR.map(s => <Pill key={s} active={sugar === s} onClick={() => setSugar(s)}>{s}</Pill>)}
            </div>
          </Section>

          <Section label="Milk">
            <div className="grid grid-cols-2 gap-2">
              {MILK.map(m => <Pill key={m} active={milk === m} onClick={() => setMilk(m)}>{m}</Pill>)}
            </div>
          </Section>

          <Section label="Add-ons">
            <div className="space-y-2">
              {ADDONS.map(a => (
                <label key={a.name} className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={addons.includes(a.name)} onChange={() => toggle(a.name)}
                           className="w-4 h-4 accent-[var(--caramel)]" />
                    <span className="text-sm">{a.name}</span>
                  </div>
                  <span className="text-sm font-medium">+{fmt(a.price)}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section label="Notes">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                      placeholder="e.g. extra hot, no foam"
                      className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </Section>
        </div>

        <div className="sticky bottom-0 bg-card border-t p-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Item total</div>
            <div className="font-display text-xl">{fmt(unitPrice)}</div>
          </div>
          <button onClick={submit} className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium text-foreground mb-2">{label}</div>
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
            className={`px-3 py-2 rounded-lg text-sm border transition ${
              active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"
            }`}>
      {children}
    </button>
  );
}
