import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "staff" | "admin";
export interface User {
  id: string;
  name: string;
  password: string;
  role: Role;
  hourlyRate?: number;
  canExport?: boolean; // authorized to export/print reports
}

export type Category = "Coffee" | "Non-Coffee" | "Iced Blended" | "Snacks" | "Rice Meals";
export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  emoji: string;
  unit: string;       // "cup", "plate", "pc"
  batchNo: string;    // batch number per product
}

export interface CartItem {
  id: string; product: Product; qty: number; size: string; sugar: string;
  milk: string; addons: string[]; notes: string; unitPrice: number;
}

export type DiscountType = "None" | "Senior" | "PWD";
export interface AppliedDiscount {
  type: DiscountType;
  idNumber?: string;     // Senior/PWD ID
  beneficiary?: string;  // person's name
}

export type StockCategory = "Ingredient" | "Furniture" | "Utensil";
export interface Ingredient {
  id: string; name: string; stock: number; min: number;
  unit: string; category: StockCategory; batchNo?: string;
}

export interface Order {
  id: string;
  number: number;        // OR number (sequential)
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  vatableSales: number;
  vatAmount: number;
  vatExemptSales: number;
  serviceCharge: number;
  total: number;
  method: "Cash" | "QR";
  cashier: string;
  createdAt: string;
  customerName?: string;
  customerAddress?: string;
  customerTin?: string;
  discount: AppliedDiscount;
}

export interface AttendanceRecord {
  id: string; userId: string; userName: string;
  clockIn: string; clockOut?: string;
}

export interface AuditEntry {
  id: string; at: string; userId: string; userName: string;
  action: string; details?: string;
}

export const PRODUCTS: Product[] = [
  { id: "c1", name: "V60 Single Origin (Hot)", price: 49, category: "Coffee", emoji: "☕", unit: "cup", batchNo: "B-C001" },
  { id: "c2", name: "Americano (Hot)", price: 65, category: "Coffee", emoji: "☕", unit: "cup", batchNo: "B-C002" },
  { id: "c3", name: "Flavored Americano (Hot)", price: 85, category: "Coffee", emoji: "☕", unit: "cup", batchNo: "B-C003" },
  { id: "c4", name: "Cappuccino (Hot)", price: 85, category: "Coffee", emoji: "☕", unit: "cup", batchNo: "B-C004" },
  { id: "c5", name: "Cafe Latte (Hot)", price: 85, category: "Coffee", emoji: "🥛", unit: "cup", batchNo: "B-C005" },
  { id: "c6", name: "Cafe Mocha (Hot)", price: 95, category: "Coffee", emoji: "🍫", unit: "cup", batchNo: "B-C006" },
  { id: "c7", name: "Caramel Macchiato (Hot)", price: 95, category: "Coffee", emoji: "☕", unit: "cup", batchNo: "B-C007" },
  { id: "c8", name: "Spanish Latte (Hot)", price: 105, category: "Coffee", emoji: "🥛", unit: "cup", batchNo: "B-C008" },
  { id: "c9", name: "White Choco Mocha (Hot)", price: 95, category: "Coffee", emoji: "🤍", unit: "cup", batchNo: "B-C009" },
  { id: "c10", name: "Hazelnut (Hot)", price: 95, category: "Coffee", emoji: "🌰", unit: "cup", batchNo: "B-C010" },
  { id: "c11", name: "French Vanilla (Hot)", price: 95, category: "Coffee", emoji: "🍦", unit: "cup", batchNo: "B-C011" },
  { id: "c12", name: "V60 Single Origin (Iced)", price: 49, category: "Coffee", emoji: "🧊", unit: "cup", batchNo: "B-C012" },
  { id: "c13", name: "Americano (Iced)", price: 65, category: "Coffee", emoji: "🧊", unit: "cup", batchNo: "B-C013" },
  { id: "c14", name: "Flavored Americano (Iced)", price: 65, category: "Coffee", emoji: "🧊", unit: "cup", batchNo: "B-C014" },
  { id: "c15", name: "Cappuccino (Iced)", price: 65, category: "Coffee", emoji: "🧊", unit: "cup", batchNo: "B-C015" },
  { id: "c16", name: "Cafe Latte (Iced)", price: 65, category: "Coffee", emoji: "🧊", unit: "cup", batchNo: "B-C016" },
  { id: "c17", name: "Cafe Mocha (Iced)", price: 65, category: "Coffee", emoji: "🧊", unit: "cup", batchNo: "B-C017" },
  { id: "c18", name: "Caramel Macchiato (Iced)", price: 65, category: "Coffee", emoji: "🧊", unit: "cup", batchNo: "B-C018" },
  { id: "c19", name: "Spanish Latte (Iced)", price: 75, category: "Coffee", emoji: "🧊", unit: "cup", batchNo: "B-C019" },
  { id: "c20", name: "White Choco Mocha (Iced)", price: 95, category: "Coffee", emoji: "🧊", unit: "cup", batchNo: "B-C020" },
  { id: "c21", name: "Biscoff Latte (Iced)", price: 75, category: "Coffee", emoji: "🍪", unit: "cup", batchNo: "B-C021" },
  { id: "c22", name: "Hazelnut (Iced)", price: 75, category: "Coffee", emoji: "🌰", unit: "cup", batchNo: "B-C022" },
  { id: "c23", name: "French Vanilla (Iced)", price: 75, category: "Coffee", emoji: "🍦", unit: "cup", batchNo: "B-C023" },

  { id: "n1", name: "Iced Choco", price: 65, category: "Non-Coffee", emoji: "🍫", unit: "cup", batchNo: "B-N001" },
  { id: "n2", name: "Oreo Milk", price: 65, category: "Non-Coffee", emoji: "🥛", unit: "cup", batchNo: "B-N002" },
  { id: "n3", name: "White Choco", price: 65, category: "Non-Coffee", emoji: "🤍", unit: "cup", batchNo: "B-N003" },
  { id: "n4", name: "Chocoberry", price: 75, category: "Non-Coffee", emoji: "🍓", unit: "cup", batchNo: "B-N004" },
  { id: "n5", name: "Strawberry Latte", price: 65, category: "Non-Coffee", emoji: "🍓", unit: "cup", batchNo: "B-N005" },
  { id: "n6", name: "Blueberry Latte", price: 65, category: "Non-Coffee", emoji: "🫐", unit: "cup", batchNo: "B-N006" },
  { id: "n7", name: "Lemon Fruitea", price: 30, category: "Non-Coffee", emoji: "🍋", unit: "cup", batchNo: "B-N007" },
  { id: "n8", name: "Kiwi Fruitea", price: 30, category: "Non-Coffee", emoji: "🥝", unit: "cup", batchNo: "B-N008" },
  { id: "n9", name: "Blueberry Fruitea", price: 30, category: "Non-Coffee", emoji: "🫐", unit: "cup", batchNo: "B-N009" },
  { id: "n10", name: "Mango Fruitea", price: 30, category: "Non-Coffee", emoji: "🥭", unit: "cup", batchNo: "B-N010" },
  { id: "n11", name: "Strawberry Fruitea", price: 30, category: "Non-Coffee", emoji: "🍓", unit: "cup", batchNo: "B-N011" },
  { id: "n12", name: "Japanese Matcha", price: 65, category: "Non-Coffee", emoji: "🍵", unit: "cup", batchNo: "B-N012" },
  { id: "n13", name: "Uji Matcha", price: 65, category: "Non-Coffee", emoji: "🍵", unit: "cup", batchNo: "B-N013" },
  { id: "n14", name: "Strawberry Matcha", price: 75, category: "Non-Coffee", emoji: "🍵", unit: "cup", batchNo: "B-N014" },
  { id: "n15", name: "Blueberry Matcha", price: 75, category: "Non-Coffee", emoji: "🍵", unit: "cup", batchNo: "B-N015" },
  { id: "n16", name: "Choco Matcha", price: 75, category: "Non-Coffee", emoji: "🍵", unit: "cup", batchNo: "B-N016" },
  { id: "n17", name: "Dirty Matcha", price: 75, category: "Non-Coffee", emoji: "🍵", unit: "cup", batchNo: "B-N017" },

  { id: "b1", name: "Cappuccino Frappe", price: 120, category: "Iced Blended", emoji: "🥤", unit: "cup", batchNo: "B-B001" },
  { id: "b2", name: "Mochachino", price: 120, category: "Iced Blended", emoji: "🥤", unit: "cup", batchNo: "B-B002" },
  { id: "b3", name: "Biscoffee", price: 150, category: "Iced Blended", emoji: "🍪", unit: "cup", batchNo: "B-B003" },
  { id: "b4", name: "Coffee Nutella", price: 150, category: "Iced Blended", emoji: "🍫", unit: "cup", batchNo: "B-B004" },
  { id: "b5", name: "Pistachio Coffee", price: 220, category: "Iced Blended", emoji: "🥜", unit: "cup", batchNo: "B-B005" },
  { id: "b6", name: "Dirty Matcha Frappe", price: 130, category: "Iced Blended", emoji: "🍵", unit: "cup", batchNo: "B-B006" },
  { id: "b7", name: "Caramel Frappe", price: 120, category: "Iced Blended", emoji: "🥤", unit: "cup", batchNo: "B-B007" },
  { id: "b8", name: "Vanilla Frappe", price: 100, category: "Iced Blended", emoji: "🍦", unit: "cup", batchNo: "B-B008" },
  { id: "b9", name: "Chocolate Frappe", price: 100, category: "Iced Blended", emoji: "🍫", unit: "cup", batchNo: "B-B009" },
  { id: "b10", name: "Salted Caramel", price: 100, category: "Iced Blended", emoji: "🧂", unit: "cup", batchNo: "B-B010" },
  { id: "b11", name: "Biscoff Biscuit", price: 150, category: "Iced Blended", emoji: "🍪", unit: "cup", batchNo: "B-B011" },
  { id: "b12", name: "Nutty Nutella", price: 150, category: "Iced Blended", emoji: "🍫", unit: "cup", batchNo: "B-B012" },
  { id: "b13", name: "Pistachio Crunch", price: 220, category: "Iced Blended", emoji: "🥜", unit: "cup", batchNo: "B-B013" },
  { id: "b14", name: "Oreo Matcha", price: 150, category: "Iced Blended", emoji: "🍵", unit: "cup", batchNo: "B-B014" },
  { id: "b15", name: "Oreo Frappe", price: 120, category: "Iced Blended", emoji: "🥤", unit: "cup", batchNo: "B-B015" },
  { id: "b16", name: "Matcha Frappe", price: 120, category: "Iced Blended", emoji: "🍵", unit: "cup", batchNo: "B-B016" },
  { id: "b17", name: "Strawberry Frappe", price: 120, category: "Iced Blended", emoji: "🍓", unit: "cup", batchNo: "B-B017" },
  { id: "b18", name: "Blueberry Frappe", price: 120, category: "Iced Blended", emoji: "🫐", unit: "cup", batchNo: "B-B018" },
  { id: "b19", name: "Fresh Lemonade", price: 85, category: "Iced Blended", emoji: "🍋", unit: "cup", batchNo: "B-B019" },

  { id: "s1", name: "Fries (Plain/Cheese/Sour Cream/BBQ)", price: 90, category: "Snacks", emoji: "🍟", unit: "serving", batchNo: "B-S001" },
  { id: "s2", name: "Nachos Overload", price: 100, category: "Snacks", emoji: "🌽", unit: "plate", batchNo: "B-S002" },
  { id: "s3", name: "Siomai 4pcs", price: 39, category: "Snacks", emoji: "🥟", unit: "4 pcs", batchNo: "B-S003" },
  { id: "s4", name: "Waffle — Plain", price: 60, category: "Snacks", emoji: "🧇", unit: "pc", batchNo: "B-S004" },
  { id: "s5", name: "Waffle — Caramel", price: 85, category: "Snacks", emoji: "🧇", unit: "pc", batchNo: "B-S005" },
  { id: "s6", name: "Waffle — Oreo Cream", price: 95, category: "Snacks", emoji: "🧇", unit: "pc", batchNo: "B-S006" },
  { id: "s7", name: "Waffle — Nutty Nutella", price: 105, category: "Snacks", emoji: "🧇", unit: "pc", batchNo: "B-S007" },
  { id: "s8", name: "Waffle — Biscoff", price: 95, category: "Snacks", emoji: "🧇", unit: "pc", batchNo: "B-S008" },
  { id: "s9", name: "Waffle — Pork Floss", price: 120, category: "Snacks", emoji: "🧇", unit: "pc", batchNo: "B-S009" },

  { id: "r1", name: "Shang-si (Shanghai, Sinangag)", price: 55, category: "Rice Meals", emoji: "🍚", unit: "plate", batchNo: "B-R001" },
  { id: "r2", name: "Shang-silog (Shanghai, Rice, Egg)", price: 70, category: "Rice Meals", emoji: "🍳", unit: "plate", batchNo: "B-R002" },
  { id: "r3", name: "Sio-silog (Siomai 4pcs, Rice, Egg)", price: 70, category: "Rice Meals", emoji: "🥟", unit: "plate", batchNo: "B-R003" },
  { id: "r4", name: "Spam-silog (Spam, Rice, Egg)", price: 85, category: "Rice Meals", emoji: "🥓", unit: "plate", batchNo: "B-R004" },
  { id: "r5", name: "Nuggets-silog (Nuggets 5pcs, Rice, Egg)", price: 120, category: "Rice Meals", emoji: "🍗", unit: "plate", batchNo: "B-R005" },
];

// 2 demo users: staff (operations), admin (full access)
export const USERS: User[] = [
  { id: "u1", name: "staff", password: "staff123", role: "staff", hourlyRate: 80, canExport: false },
  { id: "u3", name: "admin", password: "admin123", role: "admin", hourlyRate: 180, canExport: true },
];

const INITIAL_INGREDIENTS: Ingredient[] = [
  // Ingredients
  { id: "i1", name: "Coffee Beans", stock: 4200, min: 1500, unit: "g", category: "Ingredient", batchNo: "ING-2024-001" },
  { id: "i2", name: "Whole Milk", stock: 8, min: 5, unit: "L", category: "Ingredient", batchNo: "ING-2024-002" },
  { id: "i3", name: "Oat Milk", stock: 2, min: 4, unit: "L", category: "Ingredient", batchNo: "ING-2024-003" },
  { id: "i4", name: "Almond Milk", stock: 3, min: 4, unit: "L", category: "Ingredient", batchNo: "ING-2024-004" },
  { id: "i5", name: "Sugar", stock: 5200, min: 1000, unit: "g", category: "Ingredient", batchNo: "ING-2024-005" },
  { id: "i6", name: "Chocolate Syrup", stock: 1.2, min: 1, unit: "L", category: "Ingredient", batchNo: "ING-2024-006" },
  { id: "i7", name: "Matcha Powder", stock: 180, min: 200, unit: "g", category: "Ingredient", batchNo: "ING-2024-007" },
  { id: "i8", name: "Tea Bags", stock: 320, min: 100, unit: "pcs", category: "Ingredient", batchNo: "ING-2024-008" },
  { id: "i9", name: "Pastries", stock: 24, min: 10, unit: "pcs", category: "Ingredient", batchNo: "ING-2024-009" },
  // Furniture
  { id: "f1", name: "Dining Tables", stock: 8, min: 8, unit: "units", category: "Furniture" },
  { id: "f2", name: "Dining Chairs", stock: 24, min: 20, unit: "units", category: "Furniture" },
  { id: "f3", name: "Bar Stools", stock: 6, min: 4, unit: "units", category: "Furniture" },
  { id: "f4", name: "Display Shelves", stock: 3, min: 2, unit: "units", category: "Furniture" },
  // Utensils
  { id: "u1u", name: "Ceramic Cups", stock: 48, min: 30, unit: "pcs", category: "Utensil" },
  { id: "u2u", name: "Glass Mugs", stock: 36, min: 24, unit: "pcs", category: "Utensil" },
  { id: "u3u", name: "Spoons", stock: 60, min: 30, unit: "pcs", category: "Utensil" },
  { id: "u4u", name: "Forks", stock: 60, min: 30, unit: "pcs", category: "Utensil" },
  { id: "u5u", name: "Serving Trays", stock: 12, min: 8, unit: "pcs", category: "Utensil" },
];

interface Settings {
  shopName: string;
  address: string;
  phone: string;
  tin: string;                  // BIR TIN
  businessStyle: string;
  vatEnabled: boolean;          // VAT-inclusive pricing
  vatRate: number;              // 12 in PH
  serviceEnabled: boolean;
  serviceRate: number;
  receiptFooter: string;
}

const DEFAULT_SETTINGS: Settings = {
  shopName: "Cafe Corazon",
  address: "FB: CorazonsTea",
  phone: "0916 583 6120",
  tin: "000-000-000-000",
  businessStyle: "Cafe Corazon Coffee Shop",
  vatEnabled: true,
  vatRate: 12,
  serviceEnabled: false,
  serviceRate: 5,
  receiptFooter: "Thank you for visiting. See you again soon!",
};

interface Ctx {
  hydrated: boolean;
  user: User | null;
  login: (name: string, password: string) => boolean;
  logout: () => void;

  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;

  discount: AppliedDiscount;
  setDiscount: (d: AppliedDiscount) => void;

  // computed totals (VAT-inclusive pricing per PH practice)
  cartSubtotal: number;        // sum of item prices (gross, VAT-inclusive)
  discountAmount: number;
  vatableSales: number;
  vatExemptSales: number;
  vatAmount: number;
  serviceCharge: number;
  cartTotal: number;

  ingredients: Ingredient[];
  updateIngredient: (id: string, stock: number) => void;
  addIngredient: (i: Omit<Ingredient, "id">) => void;
  removeIngredient: (id: string) => void;

  orders: Order[];
  placeOrder: (method: "Cash" | "QR", customer?: { name?: string; address?: string; tin?: string }) => Order;

  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;

  employees: User[];
  addEmployee: (u: Omit<User, "id">) => void;
  removeEmployee: (id: string) => void;
  updateEmployee: (id: string, u: Partial<User>) => void;

  attendance: AttendanceRecord[];
  clockIn: (u: User) => void;
  clockOut: (id: string) => void;

  audit: AuditEntry[];
  logAudit: (action: string, details?: string) => void;
}

const PosContext = createContext<Ctx | null>(null);

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

export function PosProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<AppliedDiscount>({ type: "None" });
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [employees, setEmployees] = useState<User[]>(USERS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(load("pos.user", null));
    setIngredients(load("pos.ingredients", INITIAL_INGREDIENTS));
    setOrders(load("pos.orders", []));
    setSettings({ ...DEFAULT_SETTINGS, ...load("pos.settings", DEFAULT_SETTINGS) });
    // migrate: only staff & admin roles; convert legacy cashier→staff, drop superadmin
    const stored = load<User[]>("pos.employees", USERS);
    const migrated = stored
      .filter(e => e.name !== "superadmin")
      .map(e => (e.role as string) === "cashier" ? { ...e, role: "staff" as Role } : e);
    setEmployees(migrated.length >= 2 ? migrated : USERS);
    setAttendance(load("pos.attendance", []));
    setAudit(load("pos.audit", []));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("pos.user", JSON.stringify(user)); }, [user, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("pos.ingredients", JSON.stringify(ingredients)); }, [ingredients, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("pos.orders", JSON.stringify(orders)); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("pos.settings", JSON.stringify(settings)); }, [settings, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("pos.employees", JSON.stringify(employees)); }, [employees, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("pos.attendance", JSON.stringify(attendance)); }, [attendance, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("pos.audit", JSON.stringify(audit)); }, [audit, hydrated]);

  const logAudit = (action: string, details?: string) => {
    if (!user) return;
    setAudit(a => [{
      id: crypto.randomUUID(), at: new Date().toISOString(),
      userId: user.id, userName: user.name, action, details,
    }, ...a].slice(0, 500));
  };

  const login = (name: string, password: string) => {
    const u = employees.find(e => e.name.toLowerCase() === name.toLowerCase() && e.password === password);
    if (u) {
      setUser(u);
      setAudit(a => [{
        id: crypto.randomUUID(), at: new Date().toISOString(),
        userId: u.id, userName: u.name, action: "Login",
      }, ...a].slice(0, 500));
      return true;
    }
    return false;
  };
  const logout = () => {
    if (user) logAudit("Logout");
    setUser(null); setCart([]); setDiscount({ type: "None" });
  };

  // Computation per PH NIRC + RA 9994 (Senior) / RA 10754 (PWD):
  // Prices are VAT-inclusive (12%). Senior/PWD: 20% discount AND VAT-exempt on eligible sales.
  const gross = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const isExempt = discount.type === "Senior" || discount.type === "PWD";
  // Net-of-VAT base for exempt customers
  const baseNoVat = isExempt ? gross / (1 + settings.vatRate / 100) : gross;
  const discountAmount = isExempt ? baseNoVat * 0.20 : 0;
  const vatExemptSales = isExempt ? baseNoVat - discountAmount : 0;
  const vatableSales = isExempt ? 0 : gross / (1 + (settings.vatEnabled ? settings.vatRate / 100 : 0));
  const vatAmount = isExempt ? 0 : (settings.vatEnabled ? gross - vatableSales : 0);
  const taxableForService = isExempt ? vatExemptSales : gross;
  const serviceCharge = settings.serviceEnabled ? taxableForService * (settings.serviceRate / 100) : 0;
  const cartTotal = (isExempt ? vatExemptSales : gross) + serviceCharge;
  const cartSubtotal = gross;

  const addToCart = (item: CartItem) => setCart(c => [...c, item]);
  const removeFromCart = (id: string) => setCart(c => c.filter(i => i.id !== id));
  const updateQty = (id: string, delta: number) =>
    setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const clearCart = () => { setCart([]); setDiscount({ type: "None" }); };

  const placeOrder = (method: "Cash" | "QR", customer?: { name?: string; address?: string; tin?: string }): Order => {
    const order: Order = {
      id: crypto.randomUUID(),
      number: (orders[0]?.number ?? 100000) + 1,
      items: cart,
      subtotal: cartSubtotal,
      discountAmount,
      vatableSales,
      vatAmount,
      vatExemptSales,
      serviceCharge,
      total: cartTotal,
      method,
      cashier: user?.name ?? "—",
      createdAt: new Date().toISOString(),
      customerName: customer?.name,
      customerAddress: customer?.address,
      customerTin: customer?.tin,
      discount,
    };
    setOrders(o => [order, ...o]);
    setCart([]);
    setDiscount({ type: "None" });
    logAudit("Place order", `OR #${order.number} • ₱${order.total.toFixed(2)} • ${method}`);
    return order;
  };

  const updateIngredient = (id: string, stock: number) => {
    setIngredients(list => list.map(i => i.id === id ? { ...i, stock } : i));
    logAudit("Update stock", id);
  };
  const addIngredient = (i: Omit<Ingredient, "id">) => {
    setIngredients(list => [...list, { ...i, id: crypto.randomUUID() }]);
    logAudit("Add inventory item", i.name);
  };
  const removeIngredient = (id: string) => {
    setIngredients(list => list.filter(i => i.id !== id));
    logAudit("Remove inventory item", id);
  };

  const updateSettings = (s: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...s }));
    logAudit("Update settings", Object.keys(s).join(", "));
  };
  const addEmployee = (u: Omit<User, "id">) => {
    setEmployees(e => [...e, { ...u, id: crypto.randomUUID() }]);
    logAudit("Add employee", `${u.name} (${u.role})`);
  };
  const removeEmployee = (id: string) => {
    setEmployees(e => e.filter(x => x.id !== id));
    logAudit("Remove employee", id);
  };
  const updateEmployee = (id: string, u: Partial<User>) => {
    setEmployees(e => e.map(x => x.id === id ? { ...x, ...u } : x));
    logAudit("Update employee", id);
  };

  const clockIn = (u: User) => {
    setAttendance(a => [{
      id: crypto.randomUUID(), userId: u.id, userName: u.name,
      clockIn: new Date().toISOString(),
    }, ...a]);
    setAudit(a => [{
      id: crypto.randomUUID(), at: new Date().toISOString(),
      userId: u.id, userName: u.name, action: "Clock In",
    }, ...a].slice(0, 500));
  };
  const clockOut = (id: string) => {
    setAttendance(a => a.map(x => x.id === id ? { ...x, clockOut: new Date().toISOString() } : x));
    logAudit("Clock Out", id);
  };

  return (
    <PosContext.Provider value={{
      user, login, logout,
      cart, addToCart, removeFromCart, updateQty, clearCart,
      discount, setDiscount,
      cartSubtotal, discountAmount, vatableSales, vatExemptSales, vatAmount, serviceCharge, cartTotal,
      ingredients, updateIngredient, addIngredient, removeIngredient,
      orders, placeOrder,
      settings, updateSettings,
      employees, addEmployee, removeEmployee, updateEmployee,
      attendance, clockIn, clockOut,
      audit, logAudit,
    }}>
      {children}
    </PosContext.Provider>
  );
}

export function usePos() {
  const ctx = useContext(PosContext);
  if (!ctx) throw new Error("usePos must be inside PosProvider");
  return ctx;
}

export function fmt(n: number) { return `₱${n.toFixed(2)}`; }
