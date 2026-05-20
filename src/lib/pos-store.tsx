import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "cashier" | "admin";
export interface User { id: string; name: string; pin: string; role: Role; }
export interface Product { id: string; name: string; price: number; category: "Coffee" | "Tea" | "Snacks"; emoji: string; }
export interface CartItem { id: string; product: Product; qty: number; size: string; sugar: string; milk: string; addons: string[]; notes: string; unitPrice: number; }
export interface Ingredient { id: string; name: string; stock: number; min: number; unit: string; }
export interface Order { id: string; number: number; items: CartItem[]; total: number; method: "Cash" | "QR"; cashier: string; createdAt: string; }

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Espresso", price: 2.5, category: "Coffee", emoji: "☕" },
  { id: "p2", name: "Cappuccino", price: 3.8, category: "Coffee", emoji: "☕" },
  { id: "p3", name: "Latte", price: 4.2, category: "Coffee", emoji: "🥛" },
  { id: "p4", name: "Mocha", price: 4.5, category: "Coffee", emoji: "🍫" },
  { id: "p5", name: "Americano", price: 3.0, category: "Coffee", emoji: "☕" },
  { id: "p6", name: "Flat White", price: 4.0, category: "Coffee", emoji: "☕" },
  { id: "p7", name: "Green Tea", price: 3.2, category: "Tea", emoji: "🍵" },
  { id: "p8", name: "Earl Grey", price: 3.2, category: "Tea", emoji: "🫖" },
  { id: "p9", name: "Chai Latte", price: 3.8, category: "Tea", emoji: "🫖" },
  { id: "p10", name: "Matcha", price: 4.5, category: "Tea", emoji: "🍵" },
  { id: "p11", name: "Croissant", price: 2.8, category: "Snacks", emoji: "🥐" },
  { id: "p12", name: "Muffin", price: 2.5, category: "Snacks", emoji: "🧁" },
  { id: "p13", name: "Cheesecake", price: 4.0, category: "Snacks", emoji: "🍰" },
  { id: "p14", name: "Cookie", price: 1.8, category: "Snacks", emoji: "🍪" },
];

export const USERS: User[] = [
  { id: "u1", name: "Sara (Cashier)", pin: "1234", role: "cashier" },
  { id: "u2", name: "Admin", pin: "0000", role: "admin" },
];

const INITIAL_INGREDIENTS: Ingredient[] = [
  { id: "i1", name: "Coffee Beans", stock: 4200, min: 1500, unit: "g" },
  { id: "i2", name: "Whole Milk", stock: 8, min: 5, unit: "L" },
  { id: "i3", name: "Oat Milk", stock: 2, min: 4, unit: "L" },
  { id: "i4", name: "Almond Milk", stock: 3, min: 4, unit: "L" },
  { id: "i5", name: "Sugar", stock: 5200, min: 1000, unit: "g" },
  { id: "i6", name: "Chocolate Syrup", stock: 1.2, min: 1, unit: "L" },
  { id: "i7", name: "Matcha Powder", stock: 180, min: 200, unit: "g" },
  { id: "i8", name: "Tea Bags", stock: 320, min: 100, unit: "pcs" },
  { id: "i9", name: "Pastries", stock: 24, min: 10, unit: "pcs" },
];

interface Settings {
  shopName: string;
  address: string;
  phone: string;
  taxEnabled: boolean;
  taxRate: number;
  serviceEnabled: boolean;
  serviceRate: number;
  receiptFooter: string;
}

const DEFAULT_SETTINGS: Settings = {
  shopName: "Caramel & Co.",
  address: "12 Roasters Lane, Bean City",
  phone: "+1 (555) 010-2233",
  taxEnabled: true,
  taxRate: 8,
  serviceEnabled: false,
  serviceRate: 5,
  receiptFooter: "Thank you for visiting. See you again soon!",
};

interface Ctx {
  user: User | null;
  login: (name: string, pin: string) => boolean;
  logout: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartService: number;
  cartTotal: number;
  ingredients: Ingredient[];
  updateIngredient: (id: string, stock: number) => void;
  orders: Order[];
  placeOrder: (method: "Cash" | "QR") => Order;
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
  employees: User[];
  addEmployee: (u: Omit<User, "id">) => void;
  removeEmployee: (id: string) => void;
}

const PosContext = createContext<Ctx | null>(null);

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

export function PosProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [employees, setEmployees] = useState<User[]>(USERS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(load("pos.user", null));
    setIngredients(load("pos.ingredients", INITIAL_INGREDIENTS));
    setOrders(load("pos.orders", []));
    setSettings(load("pos.settings", DEFAULT_SETTINGS));
    setEmployees(load("pos.employees", USERS));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("pos.user", JSON.stringify(user)); }, [user, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("pos.ingredients", JSON.stringify(ingredients)); }, [ingredients, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("pos.orders", JSON.stringify(orders)); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("pos.settings", JSON.stringify(settings)); }, [settings, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("pos.employees", JSON.stringify(employees)); }, [employees, hydrated]);

  const login = (name: string, pin: string) => {
    const u = employees.find(e => e.name.toLowerCase().startsWith(name.toLowerCase()) && e.pin === pin);
    if (u) { setUser(u); return true; }
    return false;
  };
  const logout = () => { setUser(null); setCart([]); };

  const cartSubtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const cartTax = settings.taxEnabled ? cartSubtotal * (settings.taxRate / 100) : 0;
  const cartService = settings.serviceEnabled ? cartSubtotal * (settings.serviceRate / 100) : 0;
  const cartTotal = cartSubtotal + cartTax + cartService;

  const addToCart = (item: CartItem) => setCart(c => [...c, item]);
  const removeFromCart = (id: string) => setCart(c => c.filter(i => i.id !== id));
  const updateQty = (id: string, delta: number) =>
    setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const clearCart = () => setCart([]);

  const placeOrder = (method: "Cash" | "QR"): Order => {
    const order: Order = {
      id: crypto.randomUUID(),
      number: (orders[0]?.number ?? 1000) + 1,
      items: cart,
      total: cartTotal,
      method,
      cashier: user?.name ?? "—",
      createdAt: new Date().toISOString(),
    };
    setOrders(o => [order, ...o]);
    setCart([]);
    return order;
  };

  const updateIngredient = (id: string, stock: number) =>
    setIngredients(list => list.map(i => i.id === id ? { ...i, stock } : i));

  const updateSettings = (s: Partial<Settings>) => setSettings(prev => ({ ...prev, ...s }));
  const addEmployee = (u: Omit<User, "id">) => setEmployees(e => [...e, { ...u, id: crypto.randomUUID() }]);
  const removeEmployee = (id: string) => setEmployees(e => e.filter(x => x.id !== id));

  return (
    <PosContext.Provider value={{
      user, login, logout, cart, addToCart, removeFromCart, updateQty, clearCart,
      cartSubtotal, cartTax, cartService, cartTotal,
      ingredients, updateIngredient, orders, placeOrder,
      settings, updateSettings, employees, addEmployee, removeEmployee,
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

export function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}
