import { createFileRoute } from "@tanstack/react-router";
import { usePos } from "@/lib/pos-store";
import { Clock, LogIn, LogOut } from "lucide-react";

export const Route = createFileRoute("/_app/attendance")({
  component: AttendanceScreen,
});

function hoursBetween(a: string, b: string) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 3600000;
}

function AttendanceScreen() {
  const { user, attendance, clockIn, clockOut } = usePos();
  if (!user) return null;

  const myOpen = attendance.find(a => a.userId === user.id && !a.clockOut);
  const isAdmin = user.role === "admin";
  const visible = isAdmin ? attendance : attendance.filter(a => a.userId === user.id);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl mb-6">Attendance</h1>

      <div className="bg-card rounded-2xl border p-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
            <Clock className="w-6 h-6 text-accent" />
          </div>
          <div>
            <div className="font-display text-xl">{user.name}</div>
            <div className="text-sm text-muted-foreground">
              {myOpen
                ? `Clocked in at ${new Date(myOpen.clockIn).toLocaleTimeString()}`
                : "Not clocked in"}
            </div>
          </div>
        </div>
        {myOpen ? (
          <button onClick={() => clockOut(myOpen.id)}
                  className="px-5 py-3 rounded-lg bg-destructive text-destructive-foreground font-medium flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Clock Out
          </button>
        ) : (
          <button onClick={() => clockIn(user)}
                  className="px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium flex items-center gap-2">
            <LogIn className="w-4 h-4" /> Clock In
          </button>
        )}
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3">Employee</th>
              <th className="px-5 py-3">Clock In</th>
              <th className="px-5 py-3">Clock Out</th>
              <th className="px-5 py-3 text-right">Hours</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(a => (
              <tr key={a.id} className="border-t">
                <td className="px-5 py-3 font-medium">{a.userName}</td>
                <td className="px-5 py-3 text-sm">{new Date(a.clockIn).toLocaleString()}</td>
                <td className="px-5 py-3 text-sm">{a.clockOut ? new Date(a.clockOut).toLocaleString() : "—"}</td>
                <td className="px-5 py-3 text-right font-mono text-sm">
                  {a.clockOut ? hoursBetween(a.clockIn, a.clockOut).toFixed(2) : "—"}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-muted-foreground">No records yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
