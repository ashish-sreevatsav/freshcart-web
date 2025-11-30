import apiClient from '../config/api.config';
import { ProductResponse } from './products.service';

export interface CartItem {
  _id: string;
  product: ProductResponse;
  quantity: number;
  price: number;
}

export interface CartResponse {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

class CartService {
  /**
   * Get user's cart
   */
  async getCart(): Promise<CartResponse> {
    const response = await apiClient.get<{ success: boolean; data: CartResponse }>('/api/cart');
    return response.data.data;
  }

  /**
   * Add item to cart
   */
  async addToCart(data: AddToCartRequest): Promise<CartResponse> {
    const response = await apiClient.post<{ success: boolean; data: CartResponse }>(
      '/api/cart',
      data
    );
    return response.data.data;
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<CartResponse> {
    const response = await apiClient.put<{ success: boolean; data: CartResponse }>(
      `/api/cart/${itemId}`,
      data
    );
    return response.data.data;
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId: string): Promise<CartResponse> {
    const response = await apiClient.delete<{ success: boolean; data: CartResponse }>(
      `/api/cart/${itemId}`
    );
    return response.data.data;
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    await apiClient.delete('/api/cart');
  }
}

export default new CartService();
