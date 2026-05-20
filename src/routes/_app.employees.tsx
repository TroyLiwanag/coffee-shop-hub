import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePos } from "@/lib/pos-store";
import { Trash2, UserPlus, ShieldCheck, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/_app/employees")({
  component: EmployeesScreen,
});

function EmployeesScreen() {
  const { employees, addEmployee, removeEmployee, user } = usePos();
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState<"cashier" | "admin">("cashier");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pin.trim()) return;
    addEmployee({ name: name.trim(), pin: pin.trim(), role });
    setName(""); setPin(""); setRole("cashier");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl mb-6">Employees</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-card rounded-2xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">PIN</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        e.role === "admin" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
                      }`}>
                        {e.role === "admin" ? <ShieldCheck className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                      </div>
                      <span className="font-medium">{e.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${
                      e.role === "admin" ? "bg-accent/15 text-accent-foreground" : "bg-muted"
                    }`}>{e.role}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">••••</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => removeEmployee(e.id)} disabled={e.id === user?.id}
                            className="text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={submit} className="bg-card rounded-2xl border p-6 space-y-4 h-fit">
          <div className="flex items-center gap-2 font-display text-xl">
            <UserPlus className="w-5 h-5" /> Add staff
          </div>
          <div>
            <label className="text-sm font-medium">Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
                   className="mt-1.5 w-full px-3 py-2 rounded-lg border bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">PIN</label>
            <input value={pin} onChange={e => setPin(e.target.value)} type="password"
                   className="mt-1.5 w-full px-3 py-2 rounded-lg border bg-background tracking-widest" />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {(["cashier", "admin"] as const).map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                        className={`py-2 rounded-lg border text-sm capitalize ${
                          role === r ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
                        }`}>{r}</button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">
            Add employee
          </button>
        </form>
      </div>
    </div>
  );
}
