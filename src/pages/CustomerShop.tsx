import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProductCard from '@/components/ProductCard';
import { Package } from 'lucide-react';

const CustomerShop = () => {
  const { products, categories, addToCart, search, fetchProducts } = useApp();
  const [filterCat, setFilterCat] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    load();
  }, [fetchProducts]);

  const activeProducts = products.filter(p => p.active);
  const filtered = activeProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Shop</h1>
        <p className="text-muted-foreground mt-1">Browse our collection</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="flex justify-between items-center mt-4">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-8 bg-muted rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
              <h2 className="text-xl font-display font-bold text-foreground mb-2">No products found</h2>
              <p className="text-muted-foreground">Try adjusting your search or filter</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerShop;