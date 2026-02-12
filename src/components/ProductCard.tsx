import { Product } from '@/contexts/AppContext';
import { ShoppingCart, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  isOwner?: boolean;
}

const ProductCard = ({ product, onAddToCart, onEdit, isOwner }: ProductCardProps) => {
  const outOfStock = product.stock <= 0;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in group">
      <div className="aspect-square bg-muted relative overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}
        {!product.active && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-xs font-medium">
            Inactive
          </div>
        )}
        {outOfStock && product.active && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium">
            Out of Stock
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-card/80 backdrop-blur text-xs font-medium text-foreground">
          {product.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-base truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</span>
          {isOwner ? (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${product.stock > 10 ? 'bg-success/10 text-success' : product.stock > 0 ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                Stock: {product.stock}
              </span>
              <button
                onClick={() => onEdit?.(product)}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                Edit
              </button>
            </div>
          ) : (
            <button
              onClick={() => !outOfStock && onAddToCart?.(product)}
              disabled={outOfStock || !product.active}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
