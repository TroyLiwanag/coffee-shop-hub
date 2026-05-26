import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePos } from "@/lib/pos-store";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsScreen,
});

function SettingsScreen() {
  const { settings, updateSettings, logout, user } = usePos();
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="font-display text-3xl">Settings</h1>

      <Section title="Shop information">
        <Field label="Shop name" value={settings.shopName} onChange={v => updateSettings({ shopName: v })} />
        <Field label="Business style" value={settings.businessStyle} onChange={v => updateSettings({ businessStyle: v })} />
        <Field label="Address" value={settings.address} onChange={v => updateSettings({ address: v })} />
        <Field label="Phone" value={settings.phone} onChange={v => updateSettings({ phone: v })} />
        <Field label="VAT TIN" value={settings.tin} onChange={v => updateSettings({ tin: v })} />
      </Section>

      <Section title="VAT & service">
        <Toggle label="Apply VAT (12%) — VAT-inclusive pricing" checked={settings.vatEnabled} onChange={v => updateSettings({ vatEnabled: v })} />
        {settings.vatEnabled && (
          <Field label="VAT rate (%)" type="number" value={String(settings.vatRate)} onChange={v => updateSettings({ vatRate: Number(v) || 0 })} />
        )}
        <Toggle label="Apply service fee" checked={settings.serviceEnabled} onChange={v => updateSettings({ serviceEnabled: v })} />
        {settings.serviceEnabled && (
          <Field label="Service rate (%)" type="number" value={String(settings.serviceRate)} onChange={v => updateSettings({ serviceRate: Number(v) || 0 })} />
        )}
        <p className="text-xs text-muted-foreground">
          Senior Citizens (RA 9994) and PWDs (RA 10754) receive a 20% discount and are exempt from VAT.
        </p>
      </Section>

      <Section title="Receipt">
        <Field label="Footer message" value={settings.receiptFooter} onChange={v => updateSettings({ receiptFooter: v })} />
      </Section>

      <Section title="User permissions">
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Logged in as <span className="font-medium text-foreground">{user?.name}</span> ({user?.role}).</p>
          <ul className="list-disc ml-5 space-y-1">
            <li><b>Staff:</b> Attendance (clock in/out)</li>
            <li><b>Cashier:</b> POS, orders, attendance</li>
            <li><b>Admin:</b> Full access — inventory, reports, payroll, employees, audit, settings</li>
          </ul>
          <p className="mt-2 text-xs">
            Only employees marked "Authorized" in Employees can export or print reports.
          </p>
        </div>
      </Section>

      <div className="pt-2">
        <button onClick={() => { logout(); navigate({ to: "/" }); }}
                className="px-5 py-3 rounded-lg bg-destructive text-destructive-foreground font-medium flex items-center gap-2 hover:opacity-90">
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border p-6">
      <h2 className="font-display text-xl mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
             className="mt-1.5 w-full px-3 py-2 rounded-lg border bg-background" />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm font-medium">{label}</span>
      <button type="button" onClick={() => onChange(!checked)}
              className={`relative w-12 h-6 rounded-full transition ${checked ? "bg-accent" : "bg-muted"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-all ${checked ? "left-6" : "left-0.5"}`} />
      </button>
    </label>
  );
}
