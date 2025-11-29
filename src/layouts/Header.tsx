import { ShoppingCart, Search } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showSearch: boolean;
}

export function Header({ cartItemCount, onCartClick, searchQuery, onSearchChange, showSearch }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
              🛒
            </div>
            <div>
              <h1 className="text-green-600">FreshCart</h1>
              <p className="text-sm text-gray-500">Fresh groceries delivered</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all"
                />
              </div>
            )}

            <button
              onClick={onCartClick}
              className="relative p-3 hover:bg-gray-100 rounded-full transition-colors"
            >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
