import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';
const SERVER_ORIGIN = 'http://localhost:5000';

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
  cartID: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderId: number;
  productName: string;
  productPrice: number;
  productImg: string;
  productCateg: string;
  orderCount: number;
  total: number;
  status: string;
  customerName: string;
  date: string;
  items: { product: Product; quantity: number }[];
}

export interface UserData {
  userID: number;
  name: string;
  role: 'owner' | 'customer';
  avatar: string;
  userFname: string;
  userLname: string;
  userEmail?: string;
  userPhone?: string;
  userUserN?: string;
}

interface AppContextType {
  user: UserData | null;
  loginWithData: (userData: UserData) => void;
  login: (role: 'owner' | 'customer') => void;
  logout: () => void;
  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (p: Omit<Product, 'id'>, file?: File) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>, file?: File) => Promise<void>;
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
  fetchOrders: () => Promise<void>;
  placeOrder: (customerName: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => void;
  search: string;
  setSearch: (value: string) => void;
  getImageUrl: (path: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

// Map DB product row to frontend Product interface
function mapDbProduct(p: any): Product {
  return {
    id: String(p.productID),
    name: p.productName || '',
    description: p.productDescrip || '',
    price: parseFloat(p.productPrice) || 0,
    category: p.productCateg || '',
    image: p.productImg || '',
    stock: p.productStock ?? 0,
    active: (p.productStock ?? 0) > 0,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const userData = JSON.parse(saved);
        if (userData.userFname) {
          return {
            userID: userData.userID,
            name: `${userData.userFname} ${userData.userLname}`,
            role: userData.role || 'customer',
            avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.userFname}${userData.userLname}`,
            userFname: userData.userFname,
            userLname: userData.userLname,
            userEmail: userData.userEmail,
            userPhone: userData.userPhone,
            userUserN: userData.userUserN,
          };
        }
        return userData;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');

  // --- Fetch products from DB ---
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      const mapped = data.map(mapDbProduct);
      setProducts(mapped);

      // Also fetch categories
      const catRes = await fetch(`${API_BASE}/products/categories`);
      const catData = await catRes.json();
      setCategories(catData.map((name: string, idx: number) => ({ id: String(idx + 1), name })));
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  }, []);

  // --- Fetch cart from DB ---
  const fetchCart = useCallback(async () => {
    if (!user?.userID) return;
    try {
      const res = await fetch(`${API_BASE}/carts/${user.userID}`);
      const data = await res.json();
      const mapped: CartItem[] = data.map((item: any) => ({
        cartID: item.cartID,
        product: mapDbProduct(item),
        quantity: item.quantity || 1,
      }));
      setCart(mapped);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, [user?.userID]);

  // --- Fetch orders from DB ---
  const fetchOrders = useCallback(async () => {
    if (!user?.userID) return;
    try {
      const url = user.role === 'owner'
        ? `${API_BASE}/orders`
        : `${API_BASE}/orders/user/${user.userID}`;
      const res = await fetch(url);
      const data = await res.json();

      // Group orders or map individually
      const mapped: Order[] = data.map((o: any) => ({
        id: `ORD-${String(o.orderId).padStart(3, '0')}`,
        orderId: o.orderId,
        productName: o.productName,
        productPrice: parseFloat(o.productPrice) || 0,
        productImg: o.productImg || '',
        productCateg: o.productCateg || '',
        orderCount: o.orderCount || 1,
        total: parseFloat(o.orderTotalAmount) || 0,
        status: (o.orderStatus || 'pending').toLowerCase(),
        customerName: o.userFname ? `${o.userFname} ${o.userLname}` : user.name,
        date: o.orderDate ? new Date(o.orderDate).toISOString().split('T')[0] : '',
        items: [{
          product: {
            id: String(o.productID),
            name: o.productName || '',
            description: '',
            price: parseFloat(o.productPrice) || 0,
            category: o.productCateg || '',
            image: o.productImg || '',
            stock: 0,
            active: true,
          },
          quantity: o.orderCount || 1,
        }],
      }));

      setOrders(mapped);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  }, [user?.userID, user?.role, user?.name]);

  // Load data when user logs in
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (user?.userID) {
      fetchCart();
      fetchOrders();
    }
  }, [user?.userID, fetchCart, fetchOrders]);

  // --- Login ---
  const loginWithData = useCallback((userData: UserData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
  }, []);

  const login = useCallback((role: 'owner' | 'customer') => {
    // Legacy: used by facebook button — just set role
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const existing = JSON.parse(saved);
        const updated = { ...existing, role };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        return;
      } catch { /* fall through */ }
    }
    const userData: UserData = {
      userID: 0,
      name: role === 'owner' ? 'Shop Owner' : 'Customer',
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${role === 'owner' ? 'SO' : 'CU'}`,
      userFname: role === 'owner' ? 'Shop' : 'Customer',
      userLname: role === 'owner' ? 'Owner' : '',
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    setOrders([]);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('isLoggedIn');
  }, []);

  // --- Products (backend-connected) ---
  const addProduct = useCallback(async (p: Omit<Product, 'id'>, file?: File) => {
    try {
      const formData = new FormData();
      formData.append('productName', p.name);
      formData.append('productDescrip', p.description);
      formData.append('productCateg', p.category);
      formData.append('productPrice', String(p.price));
      formData.append('productStock', String(p.stock));

      if (file) {
        formData.append('productImg', file);
      } else {
        formData.append('productImg', p.image);
      }

      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        body: formData,
      });
      await fetchProducts();
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, p: Partial<Product>, file?: File) => {
    try {
      const current = products.find(prod => prod.id === id);
      if (!current) return;
      const merged = { ...current, ...p };

      const formData = new FormData();
      formData.append('productName', merged.name);
      formData.append('productDescrip', merged.description);
      formData.append('productCateg', merged.category);
      formData.append('productPrice', String(merged.price));
      formData.append('productStock', String(merged.stock));

      if (file) {
        formData.append('productImg', file);
      } else if (p.image) {
        formData.append('productImg', p.image);
      }

      await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        body: formData,
      });
      await fetchProducts();
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  }, [products, fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      await fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  }, [fetchProducts]);

  // --- Categories ---
  const addCategory = useCallback((name: string) => {
    setCategories(prev => [...prev, { id: Date.now().toString(), name }]);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  // --- Cart (backend-connected) ---
  const addToCart = useCallback(async (product: Product) => {
    if (!user?.userID) return;
    try {
      await fetch(`${API_BASE}/carts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: user.userID, productID: parseInt(product.id) }),
      });
      await fetchCart();
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  }, [user?.userID, fetchCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;
    try {
      await fetch(`${API_BASE}/carts/item/${item.cartID}`, { method: 'DELETE' });
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  }, [cart, fetchCart]);

  const updateCartQty = useCallback(async (productId: string, qty: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;
    try {
      if (qty <= 0) {
        await fetch(`${API_BASE}/carts/item/${item.cartID}`, { method: 'DELETE' });
      } else {
        await fetch(`${API_BASE}/carts/${item.cartID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: qty }),
        });
      }
      await fetchCart();
    } catch (err) {
      console.error('Failed to update cart qty:', err);
    }
  }, [cart, fetchCart]);

  const clearCart = useCallback(async () => {
    if (!user?.userID) return;
    try {
      await fetch(`${API_BASE}/carts/user/${user.userID}`, { method: 'DELETE' });
      setCart([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, [user?.userID]);

  // --- Place Order (backend-connected) ---
  const placeOrder = useCallback(async (customerName: string) => {
    if (!user?.userID || cart.length === 0) return;
    try {
      const items = cart.map(i => ({
        productID: parseInt(i.product.id),
        quantity: i.quantity,
        totalAmount: i.product.price * i.quantity,
      }));

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: user.userID, items }),
      });

      if (res.ok) {
        // Clear the cart after placing order
        await fetch(`${API_BASE}/carts/user/${user.userID}`, { method: 'DELETE' });
        setCart([]);
        await fetchOrders();
        await fetchProducts(); // refresh stock
      }
    } catch (err) {
      console.error('Failed to place order:', err);
    }
  }, [user?.userID, cart, fetchOrders, fetchProducts]);

  // --- Update Order Status ---
  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    // Extract numeric orderId from "ORD-001" format
    const numericId = id.replace('ORD-', '');
    const orderId = parseInt(numericId);
    try {
      await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
      });
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  }, [fetchOrders]);

  return (
    <AppContext.Provider value={{
      user, login, loginWithData, logout,
      products, fetchProducts, addProduct, updateProduct, deleteProduct,
      categories, addCategory, deleteCategory,
      cart, addToCart, removeFromCart, updateCartQty, clearCart,
      orders, fetchOrders, placeOrder, updateOrderStatus,
      search, setSearch,
      getImageUrl: (path: string) => {
        if (!path) return '';
        // If it's an external URL or blob/data, return as is
        if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;

        // If it's a relative path from the server (e.g. /uploads/...), use SERVER_ORIGIN
        if (path.startsWith('/uploads')) {
          return `${SERVER_ORIGIN}${path}`;
        }

        // For everything else, assume it's in the public folder (client-side)
        // ensure it starts with / for the root-relative path
        return path.startsWith('/') ? path : `/${path}`;
      }
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
