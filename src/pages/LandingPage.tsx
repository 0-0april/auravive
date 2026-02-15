import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Store, Package, BarChart3, ShieldCheck, Zap, ArrowRight, Star, TrendingUp, Users } from 'lucide-react';
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-card/80 bg-transparent border-none shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between backdrop-opacity-none rounded-full">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">Auravive</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-lg text-sm font-medium gradient-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 bg-black pb-20 px-6">
        {/* GIF Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-black -z-0 opacity-1000"
          style={{
            backgroundImage: `url('/theme2.png')`,
          }}
        />

        {/* Optional overlay for better readability - reduced opacity to show glitter */}
        <div className="fixed inset-0 bg-background/20 -z-10" />
        <div className="max-w-7xl z-0 relative">
          <div className="max-w-3xl  ml-0 mr-automx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/50 text-sm text-muted-foreground group">
              <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />
              Single-owner e-commerce platform
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight">
              Run Your Shop{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience luxury in every shade. Elevate your beauty with our premium makeup collection.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold gradient-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                Start Shopping Today
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-slide-up">
            {[
              { icon: Package, value: '500+', label: 'Products Managed' },
              { icon: Users, value: '2K+', label: 'Happy Customers' },
              { icon: TrendingUp, value: '99%', label: 'Uptime' },
              { icon: Star, value: '4.9', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-5 rounded-xl glass-card group hover:border-primary/30 transition-colors">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30 z-10" >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              Everything You Need
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
              Powerful tools for shop owners, delightful experience for customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Package,
                title: 'Product Management',
                desc: 'Create, update, and organize your catalog with categories, images, and activation controls.',
              },
              {
                icon: BarChart3,
                title: 'Real-Time Inventory',
                desc: 'Monitor stock levels, adjust quantities on the fly, and track total inventory value.',
              },
              {
                icon: Store,
                title: 'Order Processing',
                desc: 'View incoming orders, update statuses, and keep your customers informed every step.',
              },
              {
                icon: ShoppingBag,
                title: 'Seamless Shopping',
                desc: 'Customers browse, add to cart, preview totals, and place orders with ease.',
              },
              {
                icon: ShieldCheck,
                title: 'Facebook Login',
                desc: 'Quick and secure authentication for both shop owners and customers via Facebook.',
              },
              {
                icon: Zap,
                title: 'Instant Messaging',
                desc: 'Customers can reach the shop owner directly through Facebook Messenger.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-xl bg-card border border-border hover:shadow-[0_0px_20px_rgba(139,92,246,0.5)] hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center rounded-2xl gradient-primary p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground relative">
            Ready to Launch Your Shop?
          </h2>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-lg mx-auto relative">
            Join Auravive today and start managing your products, inventory, and orders in minutes.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-8 px-8 py-3.5 rounded-xl text-base font-semibold bg-card text-foreground hover:bg-card/90 transition-colors cursor-pointer relative inline-flex items-center gap-2"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">Auravive</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Auravive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;