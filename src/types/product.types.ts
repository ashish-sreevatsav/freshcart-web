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
}

export interface CartItem extends Product {
  quantity: number;
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
