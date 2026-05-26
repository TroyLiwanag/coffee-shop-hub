import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePos } from "@/lib/pos-store";
import { FileSearch } from "lucide-react";

export const Route = createFileRoute("/_app/audit")({
  component: AuditScreen,
});

function AuditScreen() {
  const { audit } = usePos();
  const [q, setQ] = useState("");

  const filtered = audit.filter(a =>
    !q || `${a.userName} ${a.action} ${a.details ?? ""}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileSearch className="w-7 h-7 text-accent" />
        <h1 className="font-display text-3xl">Audit Log</h1>
      </div>

      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by user or action…"
             className="w-full mb-4 px-4 py-2 rounded-lg border bg-background text-sm" />

      <div className="bg-card rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-t">
                <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-medium">{a.userName}</td>
                <td className="px-5 py-3 text-sm">{a.action}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{a.details || "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">No log entries.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
