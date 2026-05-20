import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePos } from "@/lib/pos-store";
import { AlertTriangle, Package } from "lucide-react";

export const Route = createFileRoute("/_app/inventory")({
  component: InventoryScreen,
});

function InventoryScreen() {
  const { ingredients, updateIngredient } = usePos();
  const [editing, setEditing] = useState<Record<string, string>>({});
  const lowCount = ingredients.filter(i => i.stock < i.min).length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">Track ingredient stock levels</p>
        </div>
        {lowCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertTriangle className="w-4 h-4" /> {lowCount} low-stock alert{lowCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3">Ingredient</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3 w-1/3">Level</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Update</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map(i => {
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
                  <td className="px-6 py-4 font-mono text-sm">{i.stock} {i.unit}</td>
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
                    <div className="flex justify-end gap-2">
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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
