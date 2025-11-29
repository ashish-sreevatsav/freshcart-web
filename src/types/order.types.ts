/**
 * Order and query related type definitions
 */

import { CartItem } from './product.types';

export type OrderStatus = 'delivered' | 'in-transit' | 'processing';
export type QueryStatus = 'pending' | 'resolved';
export type QueryCategory = 'complaint' | 'refund' | 'product-issue' | 'delivery-issue' | 'other';

export interface Query {
  id: string;
  subject: string;
  description: string;
  category: QueryCategory;
  createdAt: string;
  resolvedAt?: string;
  status: QueryStatus;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  deliveryDate: string;
  deliveryTime: string;
  address: string;
  queries?: Query[];
}

export interface BookingDetails {
  deliveryDate: string;
  deliveryTime: string;
  address: string;
  city: string;
  zipCode: string;
}
