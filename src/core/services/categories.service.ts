import apiClient from '../config/api.config';

export interface CategoryImage {
  public_id?: string;
  url: string;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: CategoryImage;
  parentCategory?: string;
  isActive: boolean;
  order?: number;
  createdAt: string;
}

export interface CategoriesListResponse {
  success: boolean;
  count: number;
  data: CategoryResponse[];
}

class CategoriesService {
  /**
   * Get all categories
   */
  async getCategories(): Promise<CategoryResponse[]> {
    const response = await apiClient.get<CategoriesListResponse>('/api/categories');
    return response.data.data;
  }

  /**
   * Get category tree (hierarchical)
   */
  async getCategoryTree(): Promise<any> {
    const response = await apiClient.get<{ success: boolean; data: any }>('/api/categories/tree');
    return response.data.data;
  }

  /**
   * Get single category
   */
  async getCategoryById(categoryId: string): Promise<CategoryResponse> {
    const response = await apiClient.get<{ success: boolean; data: CategoryResponse }>(
      `/api/categories/${categoryId}`
    );
    return response.data.data;
  }
}

export default new CategoriesService();
