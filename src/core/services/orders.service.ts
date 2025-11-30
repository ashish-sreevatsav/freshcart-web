import apiClient from '../config/api.config';

export interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CreateOrderRequest {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'Card' | 'UPI' | 'NetBanking' | 'Wallet';
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  discountPrice: number;
  totalPrice: number;
  orderNotes?: string;
}

export interface OrderResponse {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  discountPrice: number;
  totalPrice: number;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  orderNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersListResponse {
  success: boolean;
  count: number;
  total: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  data: OrderResponse[];
}

class OrdersService {
  /**
   * Create new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    const response = await apiClient.post<{ success: boolean; data: OrderResponse }>(
      '/api/orders',
      orderData
    );
    return response.data.data;
  }

  /**
   * Get user's orders
   */
  async getMyOrders(page?: number, limit?: number): Promise<OrdersListResponse> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await apiClient.get<OrdersListResponse>(
      `/api/orders?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<OrderResponse> {
    const response = await apiClient.get<{ success: boolean; data: OrderResponse }>(
      `/api/orders/${orderId}`
    );
    return response.data.data;
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string): Promise<OrderResponse> {
    const response = await apiClient.put<{ success: boolean; data: OrderResponse }>(
      `/api/orders/${orderId}/cancel`
    );
    return response.data.data;
  }
}

export default new OrdersService();
