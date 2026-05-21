import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "cashier" | "admin";
export interface User { id: string; name: string; password: string; role: Role; }
export type Category = "Coffee" | "Non-Coffee" | "Iced Blended" | "Snacks" | "Rice Meals";
export interface Product { id: string; name: string; price: number; category: Category; emoji: string; }
export interface CartItem { id: string; product: Product; qty: number; size: string; sugar: string; milk: string; addons: string[]; notes: string; unitPrice: number; }
export interface Ingredient { id: string; name: string; stock: number; min: number; unit: string; }
export interface Order { id: string; number: number; items: CartItem[]; total: number; method: "Cash" | "QR"; cashier: string; createdAt: string; }

export const PRODUCTS: Product[] = [
  // Coffee — Hot
  { id: "c1", name: "V60 Single Origin (Hot)", price: 49, category: "Coffee", emoji: "☕" },
  { id: "c2", name: "Americano (Hot)", price: 65, category: "Coffee", emoji: "☕" },
  { id: "c3", name: "Flavored Americano (Hot)", price: 85, category: "Coffee", emoji: "☕" },
  { id: "c4", name: "Cappuccino (Hot)", price: 85, category: "Coffee", emoji: "☕" },
  { id: "c5", name: "Cafe Latte (Hot)", price: 85, category: "Coffee", emoji: "🥛" },
  { id: "c6", name: "Cafe Mocha (Hot)", price: 95, category: "Coffee", emoji: "🍫" },
  { id: "c7", name: "Caramel Macchiato (Hot)", price: 95, category: "Coffee", emoji: "☕" },
  { id: "c8", name: "Spanish Latte (Hot)", price: 105, category: "Coffee", emoji: "🥛" },
  { id: "c9", name: "White Choco Mocha (Hot)", price: 95, category: "Coffee", emoji: "🤍" },
  { id: "c10", name: "Hazelnut (Hot)", price: 95, category: "Coffee", emoji: "🌰" },
  { id: "c11", name: "French Vanilla (Hot)", price: 95, category: "Coffee", emoji: "🍦" },
  // Coffee — Over Iced (Medium base)
  { id: "c12", name: "V60 Single Origin (Iced)", price: 49, category: "Coffee", emoji: "🧊" },
  { id: "c13", name: "Americano (Iced)", price: 65, category: "Coffee", emoji: "🧊" },
  { id: "c14", name: "Flavored Americano (Iced)", price: 65, category: "Coffee", emoji: "🧊" },
  { id: "c15", name: "Cappuccino (Iced)", price: 65, category: "Coffee", emoji: "🧊" },
  { id: "c16", name: "Cafe Latte (Iced)", price: 65, category: "Coffee", emoji: "🧊" },
  { id: "c17", name: "Cafe Mocha (Iced)", price: 65, category: "Coffee", emoji: "🧊" },
  { id: "c18", name: "Caramel Macchiato (Iced)", price: 65, category: "Coffee", emoji: "🧊" },
  { id: "c19", name: "Spanish Latte (Iced)", price: 75, category: "Coffee", emoji: "🧊" },
  { id: "c20", name: "White Choco Mocha (Iced)", price: 95, category: "Coffee", emoji: "🧊" },
  { id: "c21", name: "Biscoff Latte (Iced)", price: 75, category: "Coffee", emoji: "🍪" },
  { id: "c22", name: "Hazelnut (Iced)", price: 75, category: "Coffee", emoji: "🌰" },
  { id: "c23", name: "French Vanilla (Iced)", price: 75, category: "Coffee", emoji: "🍦" },

  // Non-Coffee — Over Iced
  { id: "n1", name: "Iced Choco", price: 65, category: "Non-Coffee", emoji: "🍫" },
  { id: "n2", name: "Oreo Milk", price: 65, category: "Non-Coffee", emoji: "🥛" },
  { id: "n3", name: "White Choco", price: 65, category: "Non-Coffee", emoji: "🤍" },
  { id: "n4", name: "Chocoberry", price: 75, category: "Non-Coffee", emoji: "🍓" },
  { id: "n5", name: "Strawberry Latte", price: 65, category: "Non-Coffee", emoji: "🍓" },
  { id: "n6", name: "Blueberry Latte", price: 65, category: "Non-Coffee", emoji: "🫐" },
  // Fruitea (H2O base price)
  { id: "n7", name: "Lemon Fruitea", price: 30, category: "Non-Coffee", emoji: "🍋" },
  { id: "n8", name: "Kiwi Fruitea", price: 30, category: "Non-Coffee", emoji: "🥝" },
  { id: "n9", name: "Blueberry Fruitea", price: 30, category: "Non-Coffee", emoji: "🫐" },
  { id: "n10", name: "Mango Fruitea", price: 30, category: "Non-Coffee", emoji: "🥭" },
  { id: "n11", name: "Strawberry Fruitea", price: 30, category: "Non-Coffee", emoji: "🍓" },
  // Matcha Series
  { id: "n12", name: "Japanese Matcha", price: 65, category: "Non-Coffee", emoji: "🍵" },
  { id: "n13", name: "Uji Matcha", price: 65, category: "Non-Coffee", emoji: "🍵" },
  { id: "n14", name: "Strawberry Matcha", price: 75, category: "Non-Coffee", emoji: "🍵" },
  { id: "n15", name: "Blueberry Matcha", price: 75, category: "Non-Coffee", emoji: "🍵" },
  { id: "n16", name: "Choco Matcha", price: 75, category: "Non-Coffee", emoji: "🍵" },
  { id: "n17", name: "Dirty Matcha", price: 75, category: "Non-Coffee", emoji: "🍵" },

  // Iced Blended — Coffee
  { id: "b1", name: "Cappuccino Frappe", price: 120, category: "Iced Blended", emoji: "🥤" },
  { id: "b2", name: "Mochachino", price: 120, category: "Iced Blended", emoji: "🥤" },
  { id: "b3", name: "Biscoffee", price: 150, category: "Iced Blended", emoji: "🍪" },
  { id: "b4", name: "Coffee Nutella", price: 150, category: "Iced Blended", emoji: "🍫" },
  { id: "b5", name: "Pistachio Coffee", price: 220, category: "Iced Blended", emoji: "🥜" },
  { id: "b6", name: "Dirty Matcha Frappe", price: 130, category: "Iced Blended", emoji: "🍵" },
  { id: "b7", name: "Caramel Frappe", price: 120, category: "Iced Blended", emoji: "🥤" },
  // Iced Blended — Non-Coffee
  { id: "b8", name: "Vanilla Frappe", price: 100, category: "Iced Blended", emoji: "🍦" },
  { id: "b9", name: "Chocolate Frappe", price: 100, category: "Iced Blended", emoji: "🍫" },
  { id: "b10", name: "Salted Caramel", price: 100, category: "Iced Blended", emoji: "🧂" },
  { id: "b11", name: "Biscoff Biscuit", price: 150, category: "Iced Blended", emoji: "🍪" },
  { id: "b12", name: "Nutty Nutella", price: 150, category: "Iced Blended", emoji: "🍫" },
  { id: "b13", name: "Pistachio Crunch", price: 220, category: "Iced Blended", emoji: "🥜" },
  { id: "b14", name: "Oreo Matcha", price: 150, category: "Iced Blended", emoji: "🍵" },
  { id: "b15", name: "Oreo Frappe", price: 120, category: "Iced Blended", emoji: "🥤" },
  { id: "b16", name: "Matcha Frappe", price: 120, category: "Iced Blended", emoji: "🍵" },
  { id: "b17", name: "Strawberry Frappe", price: 120, category: "Iced Blended", emoji: "🍓" },
  { id: "b18", name: "Blueberry Frappe", price: 120, category: "Iced Blended", emoji: "🫐" },
  { id: "b19", name: "Fresh Lemonade", price: 85, category: "Iced Blended", emoji: "🍋" },

  // Snacks
  { id: "s1", name: "Fries (Plain/Cheese/Sour Cream/BBQ)", price: 90, category: "Snacks", emoji: "🍟" },
  { id: "s2", name: "Nachos Overload", price: 100, category: "Snacks", emoji: "🌽" },
  { id: "s3", name: "Siomai 4pcs", price: 39, category: "Snacks", emoji: "🥟" },
  { id: "s4", name: "Waffle — Plain", price: 60, category: "Snacks", emoji: "🧇" },
  { id: "s5", name: "Waffle — Caramel", price: 85, category: "Snacks", emoji: "🧇" },
  { id: "s6", name: "Waffle — Oreo Cream", price: 95, category: "Snacks", emoji: "🧇" },
  { id: "s7", name: "Waffle — Nutty Nutella", price: 105, category: "Snacks", emoji: "🧇" },
  { id: "s8", name: "Waffle — Biscoff", price: 95, category: "Snacks", emoji: "🧇" },
  { id: "s9", name: "Waffle — Pork Floss", price: 120, category: "Snacks", emoji: "🧇" },

  // Rice Meals
  { id: "r1", name: "Shang-si (Shanghai, Sinangag)", price: 55, category: "Rice Meals", emoji: "🍚" },
  { id: "r2", name: "Shang-silog (Shanghai, Rice, Egg)", price: 70, category: "Rice Meals", emoji: "🍳" },
  { id: "r3", name: "Sio-silog (Siomai 4pcs, Rice, Egg)", price: 70, category: "Rice Meals", emoji: "🥟" },
  { id: "r4", name: "Spam-silog (Spam, Rice, Egg)", price: 85, category: "Rice Meals", emoji: "🥓" },
  { id: "r5", name: "Nuggets-silog (Nuggets 5pcs, Rice, Egg)", price: 120, category: "Rice Meals", emoji: "🍗" },
];

export const USERS: User[] = [
  { id: "u1", name: "staff", password: "staff123", role: "cashier" },
  { id: "u2", name: "admin", password: "admin123", role: "admin" },
  { id: "u3", name: "superadmin", password: "superadmin123", role: "admin" },
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
  shopName: "Cafe Corazon",
  address: "FB: CorazonsTea",
  phone: "0916 583 6120",
  taxEnabled: true,
  taxRate: 8,
  serviceEnabled: false,
  serviceRate: 5,
  receiptFooter: "Thank you for visiting. See you again soon!",
};

interface Ctx {
  user: User | null;
  login: (name: string, password: string) => boolean;
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

  const login = (name: string, password: string) => {
    const u = employees.find(e => e.name.toLowerCase() === name.toLowerCase() && e.password === password);
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
  return `₱${n.toFixed(2)}`;
}
