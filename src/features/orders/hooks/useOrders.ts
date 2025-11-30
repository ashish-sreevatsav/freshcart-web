/**
 * Custom hook for managing orders with backend integration
 */

import { useState, useCallback, useEffect } from 'react';
import { Order, CartItem, BookingDetails } from '@/types';
import { ordersService, type OrderResponse } from '@/core/services';
import { generateId } from '@/shared/utils';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Convert backend order to frontend Order type
  const convertOrder = (backendOrder: OrderResponse): Order => {
    const statusMap: Record<string, Order['status']> = {
      'Pending': 'processing',
      'Processing': 'processing',
      'Shipped': 'in-transit',
      'Delivered': 'delivered',
      'Cancelled': 'cancelled',
    };

    return {
      id: backendOrder._id,
      date: new Date(backendOrder.createdAt).toISOString().split('T')[0],
      items: backendOrder.orderItems.map(item => ({
        id: item.product,
        name: item.name,
        category: 'General', // Backend doesn't return category in order items
        price: item.price,
        unit: 'each',
        image: item.image,
        quantity: item.quantity,
      })) as CartItem[],
      total: backendOrder.totalPrice,
      status: statusMap[backendOrder.orderStatus] || 'processing',
      deliveryDate: backendOrder.estimatedDeliveryDate || backendOrder.deliveredAt 
        ? new Date(backendOrder.estimatedDeliveryDate || backendOrder.deliveredAt!).toISOString().split('T')[0]
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliveryTime: '10:00 AM - 12:00 PM', // Default, backend doesn't have time slots
      address: `${backendOrder.shippingAddress.street}, ${backendOrder.shippingAddress.city}, ${backendOrder.shippingAddress.state} ${backendOrder.shippingAddress.postalCode}`,
      paymentMethod: backendOrder.paymentMethod,
      trackingNumber: backendOrder.trackingNumber,
      queries: [], // Backend doesn't have queries yet
    };
  };

  // Fetch orders on mount - only if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersService.getMyOrders();
      const convertedOrders = response.data.map(convertOrder);
      setOrders(convertedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = useCallback(
    async (items: CartItem[], bookingDetails: BookingDetails) => {
      try {
        const itemsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxPrice = itemsPrice * 0.1; // 10% tax
        const shippingPrice = itemsPrice > 50 ? 0 : 5; // Free shipping over $50
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        const orderData = {
          orderItems: items.map(item => ({
            product: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          shippingAddress: {
            street: bookingDetails.address,
            city: bookingDetails.city,
            state: bookingDetails.state || 'NY',
            postalCode: bookingDetails.zipCode,
            country: 'USA',
            phone: bookingDetails.phone || '0000000000',
          },
          paymentMethod: (bookingDetails.paymentMethod || 'COD') as 'COD' | 'Card' | 'UPI' | 'NetBanking' | 'Wallet',
          itemsPrice,
          taxPrice,
          shippingPrice,
          discountPrice: 0,
          totalPrice,
          orderNotes: bookingDetails.specialInstructions,
        };

        const newOrder = await ordersService.createOrder(orderData);
        const convertedOrder = convertOrder(newOrder);
        setOrders((prev) => [convertedOrder, ...prev]);
        return convertedOrder;
      } catch (error: any) {
        console.error('Error creating order:', error);
        throw error;
      }
    },
    []
  );

  const addQuery = useCallback(
    (orderId: string, subject: string, category: string, description: string) => {
      // This would need a backend endpoint to store queries
      // For now, store locally
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === orderId) {
            const newQuery = {
              id: generateId('Q'),
              subject,
              description,
              category: category as any,
              createdAt: new Date().toISOString(),
              status: 'pending' as const,
            };
            return {
              ...order,
              queries: [...(order.queries || []), newQuery],
            };
          }
          return order;
        })
      );
    },
    []
  );

  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      await ordersService.cancelOrder(orderId);
      await fetchOrders(); // Refresh orders
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }, []);

  return {
    orders,
    loading,
    createOrder,
    addQuery,
    cancelOrder,
    refetch: fetchOrders,
  };
};
