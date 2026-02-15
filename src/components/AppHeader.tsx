import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, LogOut, ShoppingCart, LayoutDashboard, Package, ClipboardList, Search, X, Bell } from 'lucide-react';

const AppHeader = () => {
  const { user, logout, cart, search, setSearch, orders } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  if (isLandingPage || isLoginPage) return null;

  const isOwner = user.role === 'owner';
  const isOwnerPage = location.pathname.startsWith('/owner');
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // New orders are those with 'pending' status
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const hasNotifications = pendingOrders.length > 0;

  const ownerLinks = [
    { path: '/owner', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/owner/products', label: 'Products', icon: Package },
    { path: '/owner/orders', label: 'Orders', icon: ClipboardList },
  ];

  const customerLinks = [
    { path: '/shop', label: 'Shop', icon: ShoppingBag },
    { path: '/shop/orders', label: 'My Orders', icon: ClipboardList },
  ];

  const links = isOwner ? ownerLinks : customerLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(isOwner ? '/owner' : '/shop')} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground hidden sm:inline">Auravive</span>
          </button>
          <nav className="flex items-center gap-1">
            {links.map(l => {
              const Icon = l.icon;
              const active = location.pathname === l.path;
              return (
                <button
                  key={l.path}
                  onClick={() => navigate(l.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{l.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">

          {/* Desktop search bar */}
          {!isOwnerPage && (
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-64 pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {/* Mobile search toggle button */}
          {!isOwnerPage && (
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
          )}

          {/* Notifications for Owner */}
          {isOwner && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer relative ${notifOpen ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Bell className="w-5 h-5" />
                {hasNotifications && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-card animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl animate-scale-in overflow-hidden z-[60]">
                  <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                    <h3 className="font-bold text-sm text-foreground">Notifications</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider">{pendingOrders.length} New Orders</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {pendingOrders.length > 0 ? (
                      pendingOrders.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => { navigate('/owner/orders'); setNotifOpen(false); }}
                          className="w-full text-left p-4 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 group"
                        >
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                              <ClipboardList className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-foreground truncate">New order from {o.customerName}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{o.productName} × {o.orderCount}</div>
                              <div className="text-[10px] text-primary/70 font-medium mt-1 uppercase tracking-tighter">{o.date}</div>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No new notifications</p>
                      </div>
                    )}
                  </div>
                  {pendingOrders.length > 0 && (
                    <button
                      onClick={() => { navigate('/owner/orders'); setNotifOpen(false); }}
                      className="w-full p-3 text-xs font-bold text-primary hover:bg-muted transition-colors border-t border-border"
                    >
                      View All Orders
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {!isOwner && (
            <button
              onClick={() => navigate('/shop/cart')}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <div className="flex items-center gap-2">
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-muted" />
            <span className="text-sm font-medium text-foreground hidden sm:inline">
              {user.name} {isOwner && <span className="text-xs text-primary opacity-80">(owner)</span>}
            </span>
          </div>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile search bar (expandable) */}
      {!isOwnerPage && mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;

