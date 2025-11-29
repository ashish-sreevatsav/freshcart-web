/**
 * Main Application Component
 * Manages routing, authentication state, and global app state
 */

import { useState } from 'react';
import { PageType } from '@/types';
import { useAuth, SplashScreen, LoginPage, RegisterPage } from '@/features/auth';
import { useCart } from '@/features/cart';
import { useOrders } from '@/features/orders';
import { PRODUCTS } from '@/features/products';
import { Header, BottomNav } from '@/layouts';
import { MainRouter } from './MainRouter';

export default function App() {
  const { isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(() => {
    const hasVisited = sessionStorage.getItem('has_visited');
    if (!hasVisited) {
      sessionStorage.setItem('has_visited', 'true');
      return true;
    }
    return false;
  });
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Custom hooks for state management
  const cart = useCart();
  const { orders, createOrder, addQuery } = useOrders();

  // Show splash screen first (only on first visit)
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Show register page
  if (showRegister) {
    return (
      <RegisterPage
        onRegister={() => setShowRegister(false)}
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onRegister={() => setShowRegister(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header
        cartItemCount={cart.getTotalItems()}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={currentPage === 'home'}
      />

      <main>
        <MainRouter
          currentPage={currentPage}
          searchQuery={searchQuery}
          products={PRODUCTS}
          cart={cart}
          orders={orders}
          onCreateOrder={createOrder}
          onAddQuery={addQuery}
          isCartOpen={isCartOpen}
          onCloseCart={() => setIsCartOpen(false)}
        />
      </main>

      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
