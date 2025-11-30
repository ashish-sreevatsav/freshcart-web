/**
 * Main Application Component
 * Manages routing, authentication state, and global app state
 */

import { useState, useEffect } from 'react';
import { PageType } from '@/types';
import { useAuth, SplashScreen, LoginPage, RegisterPage } from '@/features/auth';
import { useCart } from '@/features/cart';
import { useOrders } from '@/features/orders';
import { useProducts } from '@/features/products/hooks';
import { Header, BottomNav } from '@/layouts';
import { MainRouter } from './MainRouter';

export default function App() {
  const { isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(() => {
    // Check if splash has been shown in this specific tab/window session
    const hasShownInSession = sessionStorage.getItem('splash_shown');
    return !hasShownInSession; // Show splash if not shown in this session
  });
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Custom hooks for state management
  const cart = useCart();
  const { orders, createOrder, addQuery } = useOrders();
  const { products, loading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts();

  // Refetch data when user logs in
  useEffect(() => {
    if (isAuthenticated && products.length === 0) {
      refetchProducts();
      cart.refetch();
    }
  }, [isAuthenticated]);

  // Show splash screen first (only on first visit per tab)
  if (showSplash) {
    return <SplashScreen onComplete={() => {
      sessionStorage.setItem('splash_shown', 'true');
      setShowSplash(false);
    }} />;
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
        {productsLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : productsError ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="text-red-600 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Products</h2>
              <p className="text-gray-600 mb-4">{productsError}</p>
              <p className="text-sm text-gray-500">Please make sure the backend server is running on {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}</p>
            </div>
          </div>
        ) : (
          <MainRouter
            currentPage={currentPage}
            searchQuery={searchQuery}
            products={products}
            cart={cart}
            orders={orders}
            onCreateOrder={createOrder}
            onAddQuery={addQuery}
            isCartOpen={isCartOpen}
            onCloseCart={() => setIsCartOpen(false)}
          />
        )}
      </main>

      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}
