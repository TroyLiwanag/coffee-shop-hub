import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePos, StockCategory } from "@/lib/pos-store";
import { AlertTriangle, Package, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/inventory")({
  component: InventoryScreen,
});

const TABS: StockCategory[] = ["Ingredient", "Furniture", "Utensil"];

function InventoryScreen() {
  const { ingredients, updateIngredient, addIngredient, removeIngredient } = usePos();
  const [tab, setTab] = useState<StockCategory>("Ingredient");
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", stock: "", min: "", unit: "pcs", batchNo: "" });

  const items = ingredients.filter(i => i.category === tab);
  const lowCount = ingredients.filter(i => i.stock < i.min).length;

  const add = () => {
    if (!form.name) return;
    addIngredient({
      name: form.name,
      stock: Number(form.stock) || 0,
      min: Number(form.min) || 0,
      unit: form.unit || "pcs",
      category: tab,
      batchNo: form.batchNo || undefined,
    });
    setForm({ name: "", stock: "", min: "", unit: "pcs", batchNo: "" });
    setShowAdd(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">Ingredients, furniture, utensils</p>
        </div>
        {lowCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4" /> {lowCount} low-stock alert{lowCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-full text-sm font-medium ${
                    tab === t ? "bg-primary text-primary-foreground" : "bg-card border hover:bg-muted"
                  }`}>{t}s</button>
        ))}
        <button onClick={() => setShowAdd(s => !s)}
                className="ml-auto px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add {tab.toLowerCase()}
        </button>
      </div>

      {showAdd && (
        <div className="bg-card rounded-2xl border p-5 mb-4 grid grid-cols-6 gap-3">
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                 className="col-span-2 px-3 py-2 rounded-lg border bg-background text-sm" />
          <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                 className="px-3 py-2 rounded-lg border bg-background text-sm" />
          <input type="number" placeholder="Min" value={form.min} onChange={e => setForm({ ...form, min: e.target.value })}
                 className="px-3 py-2 rounded-lg border bg-background text-sm" />
          <input placeholder="Unit (g/L/pcs)" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
                 className="px-3 py-2 rounded-lg border bg-background text-sm" />
          <button onClick={add} className="rounded-lg bg-primary text-primary-foreground text-sm">Save</button>
          {tab === "Ingredient" && (
            <input placeholder="Batch #" value={form.batchNo} onChange={e => setForm({ ...form, batchNo: e.target.value })}
                   className="col-span-6 px-3 py-2 rounded-lg border bg-background text-sm" />
          )}
        </div>
      )}

      <div className="bg-card rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3">{tab}</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Unit</th>
              {tab === "Ingredient" && <th className="px-6 py-3">Batch #</th>}
              <th className="px-6 py-3 w-1/4">Level</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => {
              const pct = Math.min(100, (i.stock / (i.min * 3)) * 100);
              const low = i.stock < i.min;
              return (
                <tr key={i.id} className="border-t">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                        <Package className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{i.name}</div>
                        <div className="text-xs text-muted-foreground">Min: {i.min} {i.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{i.stock}</td>
                  <td className="px-6 py-4 text-sm">{i.unit}</td>
                  {tab === "Ingredient" && (
                    <td className="px-6 py-4 text-xs font-mono">{i.batchNo || "—"}</td>
                  )}
                  <td className="px-6 py-4">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                           style={{
                             width: `${pct}%`,
                             background: low ? "var(--destructive)" : pct < 50 ? "var(--warning)" : "var(--success)",
                           }} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {low ? (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-destructive text-destructive-foreground">Low stock</span>
                    ) : (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/15 text-success">In stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      <input
                        value={editing[i.id] ?? ""}
                        onChange={e => setEditing({ ...editing, [i.id]: e.target.value })}
                        placeholder={String(i.stock)}
                        className="w-20 px-2 py-1.5 rounded-md border bg-background text-sm text-right" />
                      <button
                        onClick={() => {
                          const v = Number(editing[i.id]);
                          if (!isNaN(v) && v >= 0) {
                            updateIngredient(i.id, v);
                            setEditing({ ...editing, [i.id]: "" });
                          }
                        }}
                        className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90">
                        Update
                      </button>
                      <button onClick={() => removeIngredient(i.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-muted-foreground">No items yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
