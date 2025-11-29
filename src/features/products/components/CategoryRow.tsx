import { ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product, CartItem } from '@/types';

interface CategoryRowProps {
  title: string;
  subtitle: string;
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function CategoryRow({ 
  title, 
  subtitle, 
  products, 
  cartItems, 
  onAddToCart, 
  onUpdateQuantity 
}: CategoryRowProps) {
  const getQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  if (products.length === 0) return null;

  return (
    <div className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2>{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <button className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors">
            <span className="text-sm">View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Scrolling Products */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {products.map(product => (
              <div key={product.id} className="w-64 flex-shrink-0">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  quantity={getQuantity(product.id)}
                  onUpdateQuantity={onUpdateQuantity}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
