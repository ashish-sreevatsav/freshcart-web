import { Home, ShoppingBag, CreditCard, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: 'home' | 'orders' | 'billing' | 'profile';
  onPageChange: (page: 'home' | 'orders' | 'billing' | 'profile') => void;
}

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Shop' },
    { id: 'orders' as const, icon: ShoppingBag, label: 'Orders' },
    { id: 'billing' as const, icon: CreditCard, label: 'Billing' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
