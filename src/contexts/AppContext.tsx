import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  customerName: string;
  date: string;
}

interface AppContextType {
  user: { name: string; role: 'owner' | 'customer'; avatar: string } | null;
  login: (role: 'owner' | 'customer') => void;
  logout: () => void;
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  categories: Category[];
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (customerName: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  search: string;
  setSearch: (value: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const defaultCategories: Category[] = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Food & Drinks' },
  { id: '4', name: 'Home & Garden' },
];

const defaultProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones with 30hr battery life.', price: 89.99, category: 'Electronics', image: '', stock: 25, active: true },
  { id: '2', name: 'Organic Cotton T-Shirt', description: 'Soft, sustainable cotton tee in classic fit.', price: 29.99, category: 'Clothing', image: '', stock: 50, active: true },
  { id: '3', name: 'Artisan Coffee Beans', description: 'Single-origin medium roast, 500g bag.', price: 18.50, category: 'Food & Drinks', image: '', stock: 100, active: true },
  { id: '4', name: 'Ceramic Plant Pot', description: 'Handcrafted minimalist pot for indoor plants.', price: 24.00, category: 'Home & Garden', image: '', stock: 15, active: true },
  { id: '5', name: 'Smart Watch', description: 'Fitness tracker with heart rate and GPS.', price: 149.99, category: 'Electronics', image: '', stock: 0, active: false },
  { id: '6', name: 'Linen Throw Blanket', description: 'Lightweight, breathable linen blanket.', price: 55.00, category: 'Home & Garden', image: '', stock: 30, active: true },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppContextType['user']>(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const userData = JSON.parse(saved);
        // If user data has userFname/userLname, use that format
        if (userData.userFname) {
          return {
            name: `${userData.userFname} ${userData.userLname}`,
            role: userData.role || 'customer',
            avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.userFname}${userData.userLname}`
          };
        }
        return userData;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-001', items: [{ product: defaultProducts[0], quantity: 1 }], total: 89.99, status: 'confirmed', customerName: 'Jane Doe', date: '2026-02-09' },
    { id: 'ORD-002', items: [{ product: defaultProducts[2], quantity: 3 }], total: 55.50, status: 'pending', customerName: 'John Smith', date: '2026-02-10' },
  ]);
  const [search, setSearch] = useState('');

  const login = useCallback((role: 'owner' | 'customer') => {
    const userData = {
      name: role === 'owner' ? 'Shop Owner' : 'Customer',
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${role === 'owner' ? 'SO' : 'CU'}`,
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => { 
    setUser(null); 
    setCart([]);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  }, []);

  const addProduct = useCallback((p: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...p, id: Date.now().toString() }]);
  }, []);

  const updateProduct = useCallback((id: string, p: Partial<Product>) => {
    setProducts(prev => prev.map(prod => prod.id === id ? { ...prod, ...p } : prod));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addCategory = useCallback((name: string) => {
    setCategories(prev => [...prev, { id: Date.now().toString(), name }]);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.product.id !== productId)); return; }
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const placeOrder = useCallback((customerName: string) => {
    const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const order: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      items: [...cart],
      total,
      status: 'pending',
      customerName,
      date: new Date().toISOString().split('T')[0],
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
  }, [cart, orders.length]);

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      products, addProduct, updateProduct, deleteProduct,
      categories, addCategory, deleteCategory,
      cart, addToCart, removeFromCart, updateCartQty, clearCart,
      orders, placeOrder, updateOrderStatus,
      search, setSearch,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
