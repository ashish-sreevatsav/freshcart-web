/**
 * Custom hook for managing cart state and operations with backend integration
 */

import { useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { cartService } from '@/core/services';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);

  // Convert backend cart item to frontend CartItem
  const convertCartItem = (backendItem: any): CartItem => {
    const product = backendItem.product;
    const discount = product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : undefined;

    return {
      id: product._id,
      name: product.name,
      category: product.category.name,
      price: product.discountPrice || product.price,
      originalPrice: product.discountPrice ? product.price : undefined,
      discount,
      unit: product.unit,
      image: product.images[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      quantity: backendItem.quantity,
      isFeatured: product.isFeatured,
      stock: product.stock,
      cartItemId: backendItem._id, // Store the cart item ID for updates/deletes
    };
  };

  // Fetch cart on mount - only if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cart = await cartService.getCart();
      setCartId(cart._id);
      setCartItems(cart.items.map(convertCartItem));
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      // If cart doesn't exist or error, start with empty cart
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = useCallback(async (product: Product) => {
    try {
      const cart = await cartService.addToCart({
        productId: product.id,
        quantity: 1,
      });
      setCartId(cart._id);
      setCartItems(cart.items.map(convertCartItem));
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }, []);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    try {
      // Find the cart item ID
      const cartItem = cartItems.find((item) => item.id === id);
      if (!cartItem?.cartItemId) {
        console.error('Cart item not found');
        return;
      }

      if (quantity === 0) {
        // Remove item
        await removeFromCart(id);
      } else {
        // Update quantity
        const cart = await cartService.updateCartItem(cartItem.cartItemId, { quantity });
        setCartItems(cart.items.map(convertCartItem));
      }
    } catch (error: any) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  }, [cartItems]);

  const removeFromCart = useCallback(async (id: string) => {
    try {
      const cartItem = cartItems.find((item) => item.id === id);
      if (!cartItem?.cartItemId) {
        console.error('Cart item not found');
        return;
      }

      const cart = await cartService.removeFromCart(cartItem.cartItemId);
      setCartItems(cart.items.map(convertCartItem));
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }, [cartItems]);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      setCartId(null);
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }, []);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getCartItem = useCallback(
    (productId: string) => {
      return cartItems.find((item) => item.id === productId);
    },
    [cartItems]
  );

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getCartItem,
    loading,
    refetch: fetchCart,
  };
};
