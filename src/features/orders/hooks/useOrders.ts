/**
 * Custom hook for managing orders
 */

import { useState, useCallback } from 'react';
import { Order, CartItem, BookingDetails } from '@/types';
import { generateId } from '@/shared/utils';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    date: '2025-11-25',
    items: [
      {
        id: '1',
        name: 'Fresh Bananas',
        category: 'Fruits',
        price: 1.99,
        originalPrice: 2.99,
        discount: 33,
        unit: 'per lb',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
        quantity: 2,
        isFeatured: true,
      },
      {
        id: '5',
        name: 'Whole Milk',
        category: 'Dairy',
        price: 2.99,
        originalPrice: 4.29,
        discount: 30,
        unit: 'per gallon',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
        quantity: 1,
      },
    ],
    total: 10.27,
    status: 'delivered',
    deliveryDate: '2025-11-26',
    deliveryTime: '10:00 AM - 12:00 PM',
    address: '123 Main St, New York, NY 10001',
    queries: [],
  },
  {
    id: 'ORD-002',
    date: '2025-11-27',
    items: [
      {
        id: '3',
        name: 'Fresh Tomatoes',
        category: 'Vegetables',
        price: 1.49,
        originalPrice: 2.49,
        discount: 40,
        unit: 'per lb',
        image: 'https://images.unsplash.com/photo-1546470427-227b50c00b5e?w=400',
        quantity: 3,
        isFeatured: true,
      },
      {
        id: '7',
        name: 'Whole Wheat Bread',
        category: 'Bakery',
        price: 2.49,
        originalPrice: 3.49,
        discount: 29,
        unit: 'per loaf',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
        quantity: 2,
      },
    ],
    total: 14.45,
    status: 'in-transit',
    deliveryDate: '2025-11-28',
    deliveryTime: '2:00 PM - 4:00 PM',
    address: '123 Main St, New York, NY 10001',
    queries: [],
  },
];

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const createOrder = useCallback(
    (items: CartItem[], bookingDetails: BookingDetails) => {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newOrder: Order = {
        id: generateId('ORD'),
        date: new Date().toISOString().split('T')[0],
        items,
        total,
        status: 'processing',
        deliveryDate: bookingDetails.deliveryDate,
        deliveryTime: bookingDetails.deliveryTime,
        address: `${bookingDetails.address}, ${bookingDetails.city}, ${bookingDetails.zipCode}`,
        queries: [],
      };
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    },
    []
  );

  const addQuery = useCallback(
    (orderId: string, subject: string, category: string, description: string) => {
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

  return {
    orders,
    createOrder,
    addQuery,
  };
};
