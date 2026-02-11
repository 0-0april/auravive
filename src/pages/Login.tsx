import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Store } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (role: 'owner' | 'customer') => {
    login(role);
    navigate(role === 'owner' ? '/owner' : '/shop');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">Auravive</h1>
          <p className="text-muted-foreground mt-2 font-body">Your all-in-one e-commerce platform</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('owner')}
            className="w-full glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-xl transition-all duration-300 group cursor-pointer border border-border"
          >
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground text-lg">Shop Owner</div>
              <div className="text-sm text-muted-foreground">Manage products, orders & inventory</div>
            </div>
            <FacebookIcon className="ml-auto" />
          </button>

          <button
            onClick={() => handleLogin('customer')}
            className="w-full glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-xl transition-all duration-300 group cursor-pointer border border-border"
          >
            <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground text-lg">Customer</div>
              <div className="text-sm text-muted-foreground">Browse & shop products</div>
            </div>
            <FacebookIcon className="ml-auto" />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Sign in with your Facebook account to continue
        </p>
      </div>
    </div>
  );
};

function FacebookIcon({ className }: { className?: string }) {
  return (
    <div className={`w-10 h-10 rounded-lg bg-[#1877F2] flex items-center justify-center shrink-0 ${className}`}>
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </div>
  );
}

export default Login;
