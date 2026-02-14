import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { StatusBadge } from './OwnerDashboard';
import { ClipboardList, Package } from 'lucide-react';

const CustomerOrders = () => {
  const { orders, fetchOrders, getImageUrl } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };
    load();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-foreground mb-6">My Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="h-5 bg-muted rounded w-24" />
                <div className="h-4 bg-muted rounded w-20" />
              </div>
              <div className="space-y-2 mb-3">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
              <div className="h-4 bg-muted rounded w-24 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fade-in">
        <ClipboardList className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">No orders yet</h2>
        <p className="text-muted-foreground">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-foreground mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground">{o.id}</span>
                <StatusBadge status={o.status} />
              </div>
              <span className="text-sm text-muted-foreground">{o.date}</span>
            </div>
            <div className="space-y-2 mb-3">
              {o.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {item.product.image ? (
                      <img
                        src={getImageUrl(item.product.image)}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-4 h-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-foreground font-medium truncate block">{item.product.name}</span>
                    <span className="text-muted-foreground">× {item.quantity}</span>
                  </div>
                  <span className="text-foreground font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-medium text-foreground">Total</span>
              <span className="font-bold text-foreground">${o.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrders;
