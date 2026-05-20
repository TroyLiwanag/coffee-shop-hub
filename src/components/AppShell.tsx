import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { usePos } from "@/lib/pos-store";
import { Coffee, Home, Package, BarChart3, Users, Settings, LogOut, Receipt } from "lucide-react";
import { useEffect } from "react";

export function AppShell() {
  const { user, logout, settings } = usePos();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });

  useEffect(() => {
    if (user === null) navigate({ to: "/" });
  }, [user, navigate]);

  if (!user) return null;

  const navAll = [
    { to: "/pos", label: "POS", icon: Home, roles: ["cashier", "admin"] },
    { to: "/orders", label: "Orders", icon: Receipt, roles: ["cashier", "admin"] },
    { to: "/inventory", label: "Inventory", icon: Package, roles: ["admin"] },
    { to: "/reports", label: "Reports", icon: BarChart3, roles: ["admin"] },
    { to: "/employees", label: "Employees", icon: Users, roles: ["admin"] },
    { to: "/settings", label: "Settings", icon: Settings, roles: ["admin"] },
  ] as const;
  const nav = navAll.filter(n => n.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-60 bg-primary text-primary-foreground flex flex-col">
        <div className="px-6 py-7 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
              <Coffee className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <div className="font-display text-lg leading-none">{settings.shopName}</div>
              <div className="text-xs opacity-70 mt-1 capitalize">{user.role}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(item => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                  active ? "bg-accent text-accent-foreground" : "hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-4 py-2 text-xs opacity-70">{user.name}</div>
          <button
            onClick={() => { logout(); navigate({ to: "/" }); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-white/10"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
