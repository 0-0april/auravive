import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Package } from 'lucide-react';

const CartPage = () => {
  const { cart, updateCartQty, removeFromCart, placeOrder, user } = useApp();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleOrder = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      await placeOrder(user?.name || 'Customer');
      navigate('/shop/orders');
    } catch (err) {
      console.error('Failed to place order:', err);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Browse our products and add something you like!</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground font-medium cursor-pointer hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-foreground mb-6">Shopping Cart</h1>

      <div className="space-y-3 mb-6">
        {cart.map(item => (
          <div key={item.product.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
              {item.product.image ? (
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-6 h-6 text-muted-foreground/40" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{item.product.name}</h3>
              <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
              {item.product.category && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md mt-1 inline-block">
                  {item.product.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>
              <button
                onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <span className="font-bold text-foreground w-24 text-right">${(item.product.price * item.quantity).toFixed(2)}</span>
            <button
              onClick={() => removeFromCart(item.product.id)}
              className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive cursor-pointer text-muted-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Items ({cart.reduce((sum, i) => sum + i.quantity, 0)})</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between items-center">
            <span className="text-foreground font-medium">Total</span>
            <span className="text-2xl font-bold text-foreground">${subtotal.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={handleOrder}
          disabled={placing}
          className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
        >
          {placing ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
