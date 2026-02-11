import { useApp, Order } from '@/contexts/AppContext';
import { StatusBadge } from './OwnerDashboard';

const statusOptions: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const OwnerOrders = () => {
  const { orders, updateOrderStatus } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">{orders.length} orders total</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Items</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Total</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left px-5 py-3 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-foreground">{o.id}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{o.customerName}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{o.items.map(i => `${i.product.name} ×${i.quantity}`).join(', ')}</td>
                  <td className="px-5 py-4 text-sm font-medium text-foreground">${o.total.toFixed(2)}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{o.date}</td>
                  <td className="px-5 py-4">
                    <select
                      value={o.status}
                      onChange={e => updateOrderStatus(o.id, e.target.value as Order['status'])}
                      className="px-2 py-1 rounded-md border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No orders yet</div>
        )}
      </div>
    </div>
  );
};

export default OwnerOrders;
