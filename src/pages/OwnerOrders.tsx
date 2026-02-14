import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { StatusBadge } from './OwnerDashboard';

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const OwnerOrders = () => {
  const { orders, updateOrderStatus, fetchOrders, getImageUrl } = useApp();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Group orders by customerName
  const groupedOrders = orders.reduce((groups, order) => {
    const name = order.customerName || 'Unknown Customer';
    if (!groups[name]) groups[name] = [];
    groups[name].push(order);
    return groups;
  }, {} as Record<string, typeof orders>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">{orders.length} orders total across {Object.keys(groupedOrders).length} customers</p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedOrders).map(([customerName, userOrders]) => (
          <div key={customerName} className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in shadow-sm">
            <div className="px-6 py-4 bg-muted/30 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {customerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{customerName}</h3>
                  <p className="text-xs text-muted-foreground">{userOrders.length} order(s) placed</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-border">
              {userOrders.map(o => (
                <div key={o.id + '-' + o.orderId} className="p-6 hover:bg-muted/10 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex gap-4">
                      {o.productImg && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
                          <img
                            src={getImageUrl(o.productImg)}
                            alt={o.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{o.id}</div>
                        <h4 className="font-bold text-foreground text-lg leading-tight">{o.productName}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Category: <span className="text-foreground font-medium">{o.productCateg}</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ref Price: <span className="text-foreground font-medium">${o.productPrice.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Total {o.orderCount > 1 ? `(${o.orderCount} items)` : ''}</div>
                        <div className="text-xl font-bold text-foreground">${o.total.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground mt-1">{o.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={o.status}
                          onChange={e => updateOrderStatus(o.id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-input bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer transition-all hover:border-primary"
                        >
                          {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-24 bg-card rounded-2xl border border-border border-dashed">
            <div className="text-muted-foreground text-lg">No orders yet</div>
            <p className="text-sm text-muted-foreground/60 mt-2">Orders from customers will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerOrders;
