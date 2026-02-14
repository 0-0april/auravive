import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, LogOut, ShoppingCart, LayoutDashboard, Package, ClipboardList, Search, X } from 'lucide-react';

const AppHeader = () => {
  const { user, logout, cart, search, setSearch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  if (!user) return null;

  const isOwner = user.role === 'owner';
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

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
          {!isOwner && (
            <>
              {/* Desktop search bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Mobile search toggle button */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
              >
                {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

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
            </>
          )}
          <div className="flex items-center gap-2">
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full bg-muted" />
            <span className="text-sm font-medium text-foreground hidden sm:inline">{user.name}</span>
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
      {!isOwner && mobileSearchOpen && (
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
