import { ProductCard } from './ProductCard';
import type { Product, CartItem } from '@/types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => Promise<void>;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function ProductGrid({ products, onAddToCart, cartItems, onUpdateQuantity }: ProductGridProps) {
  const getQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
          quantity={getQuantity(product.id)}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
}
