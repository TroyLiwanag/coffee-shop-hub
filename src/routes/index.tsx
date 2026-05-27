import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { usePos } from "@/lib/pos-store";
import logo from "@/assets/cafe-corazon-logo.png";

export const Route = createFileRoute("/")({
  component: LoginScreen,
});

function LoginScreen() {
  const { user, login } = usePos();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (user) navigate({ to: "/pos" });
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!login(name.trim(), password.trim())) {
      setErr("Invalid username or password. Try staff / staff123 or admin / admin123.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
         style={{ background: "linear-gradient(135deg, var(--cream), var(--background))" }}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full bg-card flex items-center justify-center shadow-lg overflow-hidden border-4 border-card">
            <img src={logo} alt="Cafe Corazon logo" className="w-full h-full object-contain p-1" />
          </div>
          <h1 className="font-display text-3xl mt-4 text-foreground">Cafe Corazon</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your station</p>
        </div>

        <form onSubmit={submit} className="bg-card rounded-2xl shadow-xl p-8 space-y-5 border">
          <div>
            <label className="text-sm font-medium text-foreground">Username</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="staff"
                   className="mt-2 w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                   className="mt-2 w-full px-4 py-3 rounded-lg border border-input bg-background tracking-widest focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {err && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
              {err}
            </div>
          )}
          <button type="submit"
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
            Log in
          </button>
          <div className="text-xs text-center text-muted-foreground pt-2 border-t space-y-1">
            <div>Demo accounts:</div>
            <div><span className="font-medium">staff / staff123</span> — POS, orders, attendance</div>
            <div><span className="font-medium">admin / admin123</span> — full access</div>
          </div>
        </form>
      </div>
    </div>
  );
}
