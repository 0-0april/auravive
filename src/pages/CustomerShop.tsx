import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProductCard from '@/components/ProductCard';

const CustomerShop = () => {
  const { products, categories, addToCart, search } = useApp();
  const [filterCat, setFilterCat] = useState('All');

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No products found</div>
      )}
    </div>
  );
};

export default CustomerShop;
