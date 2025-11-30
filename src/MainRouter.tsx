/**
 * Main Router Component
 * Handles page routing and layout
 */

import React, { useState } from 'react';
import { PageType, Product, Order, BookingDetails, CartItem } from '@/types';
import { HomePage } from '@/features/products';
import { OrdersPage } from '@/features/orders';
import { BillingPage } from '@/features/billing';
import { ProfilePage } from '@/features/profile';
import { Cart, CheckoutModal } from '@/features/cart';

interface MainRouterProps {
  currentPage: PageType;
  searchQuery: string;
  products: Product[];
  cart: {
    cartItems: CartItem[];
    addToCart: (product: Product) => Promise<void>;
    updateQuantity: (id: string, quantity: number) => void;
    removeFromCart: (id: string) => void;
    getTotalPrice: () => number;
    clearCart: () => void;
  };
  orders: Order[];
  onCreateOrder: (items: CartItem[], bookingDetails: BookingDetails) => Order;
  onAddQuery: (orderId: string, subject: string, category: string, description: string) => void;
  isCartOpen: boolean;
  onCloseCart: () => void;
}

export function MainRouter({
  currentPage,
  searchQuery,
  products,
  cart,
  orders,
  onCreateOrder,
  onAddQuery,
  isCartOpen,
  onCloseCart,
}: MainRouterProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    onCloseCart();
    setIsCheckoutOpen(true);
  };

  const handleCompleteBooking = (bookingDetails: BookingDetails) => {
    onCreateOrder(cart.cartItems, bookingDetails);
    cart.clearCart();
    setIsCheckoutOpen(false);
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage
          products={products}
          searchQuery={searchQuery}
          cartItems={cart.cartItems}
          onAddToCart={cart.addToCart}
          onUpdateQuantity={cart.updateQuantity}
        />
      )}

      {currentPage === 'orders' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <OrdersPage
            orders={orders}
            onAddQuery={onAddQuery}
            onReorder={(items, bookingDetails) => onCreateOrder(items, bookingDetails)}
          />
        </div>
      )}

      {currentPage === 'billing' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BillingPage orders={orders} />
        </div>
      )}

      {currentPage === 'profile' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProfilePage />
        </div>
      )}

      {isCartOpen && (
        <Cart
          items={cart.cartItems}
          onClose={onCloseCart}
          onUpdateQuantity={cart.updateQuantity}
          onRemoveItem={cart.removeFromCart}
          onCheckout={handleCheckout}
          totalPrice={cart.getTotalPrice()}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          items={cart.cartItems}
          totalPrice={cart.getTotalPrice()}
          onClose={() => setIsCheckoutOpen(false)}
          onComplete={handleCompleteBooking}
        />
      )}
    </>
  );
}
