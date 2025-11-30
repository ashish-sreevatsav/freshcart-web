import { Plus, Minus } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/common/ImageWithFallback';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => Promise<void>;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart, quantity, onUpdateQuantity }: ProductCardProps) {
  const handleAddToCart = async () => {
    try {
      console.log('Adding to cart:', { productId: product.id, productName: product.name });
      await onAddToCart(product);
      console.log('Successfully added to cart');
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add item to cart. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1">
            <span className="text-xs">{product.discount}% OFF</span>
          </div>
        )}
        
        {/* Quantity Badge */}
        {quantity > 0 && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-lg">
            <span className="text-sm">{quantity}</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
          {product.category}
        </span>
        <h3 className="mt-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center justify-between mt-3">
          <div>
            {product.originalPrice ? (
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-gray-500">{product.unit}</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-900">${product.price.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{product.unit}</p>
              </div>
            )}
          </div>
          
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-green-50 rounded-lg p-1 flex-shrink-0">
              <button
                onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                className="p-1 hover:bg-white rounded transition-colors"
              >
                <Minus className="w-4 h-4 text-green-600" />
              </button>
              <span className="text-sm px-2 min-w-[20px] text-center">{quantity}</span>
              <button
                onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                className="p-1 hover:bg-white rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-green-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
