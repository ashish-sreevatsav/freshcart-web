import { CategoryRow } from './CategoryRow';
import { AdBanner } from './AdBanner';
import { CelebrityPromo } from './CelebrityPromo';
import { ProductGrid } from './ProductGrid';
import { Tag } from 'lucide-react';
import type { Product, CartItem } from '@/types';

interface HomePageProps {
  products: Product[];
  searchQuery: string;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function HomePage({ products, searchQuery, cartItems, onAddToCart, onUpdateQuantity }: HomePageProps) {
  const featuredProducts = products.filter(p => p.isFeatured);
  
  // Group products by category
  const getProductsByCategory = (categories: string[]) => {
    return products.filter(p => categories.includes(p.category) && !p.isFeatured);
  };

  const fruitsVeggies = getProductsByCategory(['Fruits', 'Vegetables']);
  const dairyBreakfast = getProductsByCategory(['Dairy', 'Bakery']);
  const snacksMunchies = getProductsByCategory(['Snacks', 'Beverages']);
  const meatSeafood = getProductsByCategory(['Meat', 'Seafood']);
  const pantryEssentials = getProductsByCategory(['Pantry']);
  const frozenFoods = getProductsByCategory(['Frozen']);
  const household = getProductsByCategory(['Household']);
  
  // Search results
  if (searchQuery) {
    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="mb-6">Search Results for "{searchQuery}"</h2>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <ProductGrid 
            products={filteredProducts} 
            onAddToCart={onAddToCart}
            cartItems={cartItems}
            onUpdateQuantity={onUpdateQuantity}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Featured Deals Section */}
      <section className="bg-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Tag className="w-6 h-6 text-red-600" />
            <h2 className="text-red-600">Today's Best Deals</h2>
            <span className="ml-2 px-3 py-1 bg-red-600 text-white text-sm rounded-full">
              Limited Time
            </span>
          </div>
          <ProductGrid 
            products={featuredProducts} 
            onAddToCart={onAddToCart}
            cartItems={cartItems}
            onUpdateQuantity={onUpdateQuantity}
          />
        </div>
      </section>

      {/* Ad Banners */}
      <section className="max-w-7xl mx-auto px-4">
        <AdBanner />
      </section>

      {/* Category Rows - Horizontal Scrolling */}
      <section className="space-y-8">
        <CategoryRow
          title="Fruits & Vegetables"
          subtitle="Fresh from the farm"
          products={fruitsVeggies}
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
        />

        <CategoryRow
          title="Dairy & Breakfast"
          subtitle="Start your day right"
          products={dairyBreakfast}
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
        />

        <CategoryRow
          title="Snacks & Beverages"
          subtitle="Munchies for every mood"
          products={snacksMunchies}
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
        />

        {/* Celebrity Promo Section */}
        <div className="max-w-7xl mx-auto px-4">
          <CelebrityPromo />
        </div>

        <CategoryRow
          title="Meat & Seafood"
          subtitle="Premium quality cuts"
          products={meatSeafood}
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
        />

        <CategoryRow
          title="Pantry Essentials"
          subtitle="Stock up your kitchen"
          products={pantryEssentials}
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
        />

        <CategoryRow
          title="Frozen Foods"
          subtitle="Quick & convenient meals"
          products={frozenFoods}
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
        />

        <CategoryRow
          title="Household Essentials"
          subtitle="Keep your home fresh"
          products={household}
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
        />
      </section>
    </div>
  );
}
