import { useState, useEffect } from 'react';
import { productsService, type ProductResponse } from '@/core/services';
import { Product } from '@/types';

/**
 * Custom hook for fetching and managing products
 */
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert backend product response to frontend Product type
  const convertToProduct = (backendProduct: ProductResponse): Product => {
    const discount = backendProduct.discountPrice
      ? Math.round(((backendProduct.price - backendProduct.discountPrice) / backendProduct.price) * 100)
      : undefined;

    return {
      id: backendProduct._id,
      name: backendProduct.name,
      category: backendProduct.category.name,
      price: backendProduct.discountPrice || backendProduct.price,
      originalPrice: backendProduct.discountPrice ? backendProduct.price : undefined,
      discount,
      unit: backendProduct.unit,
      image: backendProduct.images[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      isFeatured: backendProduct.isFeatured,
      rating: backendProduct.rating,
      numReviews: backendProduct.numReviews,
      stock: backendProduct.stock,
      description: backendProduct.description,
    };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsService.getProducts({ limit: 100 });
      const convertedProducts = response.data.map(convertToProduct);
      setProducts(convertedProducts);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};
