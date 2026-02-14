import { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Package, DollarSign, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';

const OwnerDashboard = () => {
  const { products, orders, fetchProducts, fetchOrders } = useApp();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.active).length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const inventoryValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter(p => p.stock === 0);
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const stats = [
    { label: 'Total Products', value: totalProducts, sub: `${activeProducts} active`, icon: Package, color: 'bg-primary/10 text-primary' },
    { label: 'Total Stock', value: totalStock, sub: `${outOfStock.length} out of stock`, icon: TrendingUp, color: 'bg-success/10 text-success' },
    { label: 'Inventory Value', value: `$${inventoryValue.toFixed(2)}`, sub: 'Total worth', icon: DollarSign, color: 'bg-secondary/10 text-secondary' },
    { label: 'Orders', value: orders.length, sub: `${pendingOrders} pending`, icon: ShoppingCart, color: 'bg-warning/10 text-warning' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card rounded-xl border border-border p-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-foreground">Low Stock Alert</h3>
          </div>
          <div className="space-y-2">
            {lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{p.name}</span>
                <span className="text-warning font-medium">{p.stock} remaining</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-bold text-foreground text-lg">Recent Orders</h3>
        </div>
        <div className="divide-y divide-border">
          {orders.slice(0, 5).map(o => (
            <div key={o.id + '-' + o.orderId} className="p-4 flex items-center justify-between">
              <div>
                <span className="font-medium text-foreground">{o.id}</span>
                <span className="text-muted-foreground text-sm ml-3">{o.customerName}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-foreground font-medium">${o.total.toFixed(2)}</span>
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </div>
        {orders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No orders yet</div>
        )}
      </div>
    </div>
  );
};

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-warning/10 text-warning',
    confirmed: 'bg-primary/10 text-primary',
    shipped: 'bg-secondary/10 text-secondary',
    delivered: 'bg-success/10 text-success',
    cancelled: 'bg-destructive/10 text-destructive',
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${styles[status] || ''}`}>
      {status}
    </span>
  );
}

export default OwnerDashboard;
