/**
 * Product related type definitions
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  unit: string;
  image: string;
  isFeatured?: boolean;
  rating?: number;
  numReviews?: number;
  stock?: number;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  cartItemId?: string; // Backend cart item ID for updates/deletes
}

export type ProductCategory = 
  | 'Fruits' 
  | 'Vegetables' 
  | 'Dairy' 
  | 'Bakery' 
  | 'Meat' 
  | 'Seafood' 
  | 'Pantry' 
  | 'Snacks' 
  | 'Beverages' 
  | 'Frozen' 
  | 'Household';
