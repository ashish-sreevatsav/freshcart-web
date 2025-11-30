import apiClient from '../config/api.config';

export interface ProductImage {
  public_id: string;
  url: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug?: string;
}

export interface ProductReview {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: ProductCategory;
  images: ProductImage[];
  brand?: string;
  unit: string;
  unitValue: number;
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  tags?: string[];
  reviews?: ProductReview[];
}

export interface ProductsListResponse {
  success: boolean;
  count: number;
  total: number;
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  data: ProductResponse[];
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
}

export interface AddReviewRequest {
  rating: number;
  comment: string;
}

class ProductsService {
  /**
   * Get all products with filters
   */
  async getProducts(params?: GetProductsParams): Promise<ProductsListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.minPrice) queryParams.append('price[gte]', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('price[lte]', params.maxPrice.toString());
    if (params?.isFeatured !== undefined) queryParams.append('isFeatured', params.isFeatured.toString());

    const response = await apiClient.get<ProductsListResponse>(
      `/api/products?${queryParams.toString()}`
    );
    return response.data;
  }

  /**
   * Get single product by ID
   */
  async getProductById(productId: string): Promise<ProductResponse> {
    const response = await apiClient.get<{ success: boolean; data: ProductResponse }>(
      `/api/products/${productId}`
    );
    return response.data.data;
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(): Promise<ProductResponse[]> {
    const response = await apiClient.get<{ success: boolean; data: ProductResponse[] }>(
      '/api/products/featured'
    );
    return response.data.data;
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string): Promise<ProductResponse[]> {
    const response = await apiClient.get<{ success: boolean; data: ProductResponse[] }>(
      `/api/products/category/${categoryId}`
    );
    return response.data.data;
  }

  /**
   * Add product review
   */
  async addReview(productId: string, review: AddReviewRequest): Promise<void> {
    await apiClient.post(`/api/products/${productId}/reviews`, review);
  }
}

export default new ProductsService();
