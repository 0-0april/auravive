import { useState } from 'react';
import { useApp, Product } from '@/contexts/AppContext';
import ProductCard from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';
import { Plus, Search, Tag, X } from 'lucide-react';

const OwnerProducts = () => {
  const { products, categories, addCategory, deleteCategory, deleteProduct } = useApp();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [newCat, setNewCat] = useState('');
  const [showCatManager, setShowCatManager] = useState(false);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">{products.length} products total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCatManager(!showCatManager)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors cursor-pointer font-medium text-sm"
          >
            <Tag className="w-4 h-4" /> Categories
          </button>
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {showCatManager && (
        <div className="bg-card rounded-xl border border-border p-5 mb-6 animate-fade-in">
          <h3 className="font-semibold text-foreground mb-3">Manage Categories</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map(c => (
              <span key={c.id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-foreground text-sm">
                {c.name}
                <button onClick={() => deleteCategory(c.id)} className="hover:text-destructive cursor-pointer"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              placeholder="New category..."
              className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => { if (newCat.trim()) { addCategory(newCat.trim()); setNewCat(''); } }}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:opacity-90"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
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
          <div key={p.id} className="relative group">
            <ProductCard product={p} isOwner onEdit={() => { setEditingProduct(p); setShowForm(true); }} />
            <button
              onClick={() => deleteProduct(p.id)}
              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-xs font-medium cursor-pointer z-10"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No products found</div>
      )}

      {showForm && (
        <ProductForm product={editingProduct} onClose={() => { setShowForm(false); setEditingProduct(null); }} />
      )}
    </div>
  );
};

export default OwnerProducts;
