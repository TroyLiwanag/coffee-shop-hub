import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePos, Role } from "@/lib/pos-store";
import { Trash2, UserPlus, ShieldCheck, User as UserIcon, Briefcase } from "lucide-react";

export const Route = createFileRoute("/_app/employees")({
  component: EmployeesScreen,
});

function EmployeesScreen() {
  const { employees, addEmployee, removeEmployee, updateEmployee, user } = usePos();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("cashier");
  const [hourlyRate, setHourlyRate] = useState("");
  const [canExport, setCanExport] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;
    addEmployee({
      name: name.trim(), password: password.trim(), role,
      hourlyRate: Number(hourlyRate) || 0,
      canExport,
    });
    setName(""); setPassword(""); setRole("cashier"); setHourlyRate(""); setCanExport(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="font-display text-3xl mb-6">Employees</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-card rounded-2xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Rate/hr</th>
                <th className="px-5 py-3">Export</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        e.role === "admin" ? "bg-accent text-accent-foreground"
                          : e.role === "cashier" ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-foreground"
                      }`}>
                        {e.role === "admin" ? <ShieldCheck className="w-4 h-4" />
                          : e.role === "cashier" ? <UserIcon className="w-4 h-4" />
                          : <Briefcase className="w-4 h-4" />}
                      </div>
                      <span className="font-medium">{e.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${
                      e.role === "admin" ? "bg-accent/15 text-accent-foreground" : "bg-muted"
                    }`}>{e.role}</span>
                  </td>
                  <td className="px-5 py-4 text-sm">₱{(e.hourlyRate || 0).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => updateEmployee(e.id, { canExport: !e.canExport })}
                            className={`text-xs px-2.5 py-1 rounded-full ${
                              e.canExport ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                            }`}>
                      {e.canExport ? "Authorized" : "Restricted"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
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
            <UserPlus className="w-5 h-5" /> Add user
          </div>
          <div>
            <label className="text-sm font-medium">Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
                   className="mt-1.5 w-full px-3 py-2 rounded-lg border bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password"
                   className="mt-1.5 w-full px-3 py-2 rounded-lg border bg-background tracking-widest" />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {(["staff", "cashier", "admin"] as Role[]).map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                        className={`py-2 rounded-lg border text-sm capitalize ${
                          role === r ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"
                        }`}>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Hourly rate (₱)</label>
            <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)}
                   className="mt-1.5 w-full px-3 py-2 rounded-lg border bg-background" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={canExport} onChange={e => setCanExport(e.target.checked)} />
            Authorize to export / print reports
          </label>
          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">
            Add user
          </button>
        </form>
      </div>
    </div>
  );
}
