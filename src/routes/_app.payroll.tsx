import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { usePos, fmt } from "@/lib/pos-store";
import { Wallet, Download, Lock } from "lucide-react";

export const Route = createFileRoute("/_app/payroll")({
  component: PayrollScreen,
});

type Period = "Weekly" | "Bi-weekly" | "Monthly";

function PayrollScreen() {
  const { employees, attendance, user } = usePos();
  const [period, setPeriod] = useState<Period>("Weekly");
  const canExport = user?.canExport || user?.role === "admin";

  const days = period === "Weekly" ? 7 : period === "Bi-weekly" ? 14 : 30;
  const cutoff = Date.now() - days * 86400000;

  const rows = useMemo(() => employees.map(e => {
    const recs = attendance.filter(a =>
      a.userId === e.id && a.clockOut && new Date(a.clockIn).getTime() >= cutoff
    );
    const hours = recs.reduce((s, a) =>
      s + (new Date(a.clockOut!).getTime() - new Date(a.clockIn).getTime()) / 3600000, 0);
    const regular = Math.min(hours, days * 8);
    const overtime = Math.max(0, hours - regular);
    const rate = e.hourlyRate || 0;
    const gross = regular * rate + overtime * rate * 1.25; // OT 25% per PH Labor Code
    const sss = gross * 0.045;           // approximate employee share
    const philhealth = gross * 0.025;
    const pagibig = Math.min(100, gross * 0.02);
    const deductions = sss + philhealth + pagibig;
    const net = gross - deductions;
    return { e, hours, regular, overtime, rate, gross, sss, philhealth, pagibig, deductions, net };
  }), [employees, attendance, cutoff]);

  const exportCsv = () => {
    if (!canExport) { alert("Only authorized personnel can export payroll."); return; }
    const header = ["Employee", "Role", "Rate/hr", "Hours", "OT Hours", "Gross", "SSS", "PhilHealth", "Pag-IBIG", "Net Pay"];
    const csv = [header, ...rows.map(r => [
      r.e.name, r.e.role, r.rate.toFixed(2), r.regular.toFixed(2), r.overtime.toFixed(2),
      r.gross.toFixed(2), r.sss.toFixed(2), r.philhealth.toFixed(2), r.pagibig.toFixed(2), r.net.toFixed(2),
    ])].map(r => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = `payroll-${period.toLowerCase()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const totalNet = rows.reduce((s, r) => s + r.net, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wallet className="w-7 h-7 text-accent" />
          <h1 className="font-display text-3xl">Employee Payroll</h1>
        </div>
        <button onClick={exportCsv} disabled={!canExport}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-40">
          {canExport ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />} Export CSV
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(["Weekly", "Bi-weekly", "Monthly"] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
                  className={`px-5 py-2 rounded-full text-sm font-medium ${
                    period === p ? "bg-primary text-primary-foreground" : "bg-card border hover:bg-muted"
                  }`}>{p}</button>
        ))}
        <div className="ml-auto bg-card border rounded-lg px-4 py-2 text-sm">
          Total payroll: <span className="font-display text-lg text-accent">{fmt(totalNet)}</span>
        </div>
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3 text-right">Rate/hr</th>
              <th className="px-4 py-3 text-right">Reg. Hrs</th>
              <th className="px-4 py-3 text-right">OT Hrs</th>
              <th className="px-4 py-3 text-right">Gross</th>
              <th className="px-4 py-3 text-right">SSS</th>
              <th className="px-4 py-3 text-right">PhilHealth</th>
              <th className="px-4 py-3 text-right">Pag-IBIG</th>
              <th className="px-4 py-3 text-right">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.e.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.e.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{r.e.role}</div>
                </td>
                <td className="px-4 py-3 text-right text-sm">{fmt(r.rate)}</td>
                <td className="px-4 py-3 text-right text-sm">{r.regular.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-sm">{r.overtime.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-sm">{fmt(r.gross)}</td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground">{fmt(r.sss)}</td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground">{fmt(r.philhealth)}</td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground">{fmt(r.pagibig)}</td>
                <td className="px-4 py-3 text-right font-display text-base text-accent">{fmt(r.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Computation: Gross = Regular hours × rate + Overtime × rate × 1.25 (PH Labor Code Art. 87).
        Deductions follow indicative SSS, PhilHealth, and Pag-IBIG employee contribution rates.
      </p>
    </div>
  );
}
