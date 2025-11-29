/**
 * Product-related constants
 */

import { ProductCategory } from '@/types';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Fruits',
  'Vegetables',
  'Dairy',
  'Bakery',
  'Meat',
  'Seafood',
  'Pantry',
  'Snacks',
  'Beverages',
  'Frozen',
  'Household',
];

export const CATEGORY_GROUPS = {
  FRUITS_VEGGIES: ['Fruits', 'Vegetables'],
  DAIRY_BREAKFAST: ['Dairy', 'Bakery'],
  SNACKS_BEVERAGES: ['Snacks', 'Beverages'],
  MEAT_SEAFOOD: ['Meat', 'Seafood'],
  PANTRY: ['Pantry'],
  FROZEN: ['Frozen'],
  HOUSEHOLD: ['Household'],
} as const;

export const CATEGORY_LABELS = {
  FRUITS_VEGGIES: {
    title: 'Fruits & Vegetables',
    subtitle: 'Fresh from the farm',
  },
  DAIRY_BREAKFAST: {
    title: 'Dairy & Breakfast',
    subtitle: 'Start your day right',
  },
  SNACKS_BEVERAGES: {
    title: 'Snacks & Beverages',
    subtitle: 'Munchies for every mood',
  },
  MEAT_SEAFOOD: {
    title: 'Meat & Seafood',
    subtitle: 'Premium quality cuts',
  },
  PANTRY: {
    title: 'Pantry Essentials',
    subtitle: 'Stock up your kitchen',
  },
  FROZEN: {
    title: 'Frozen Foods',
    subtitle: 'Quick & convenient meals',
  },
  HOUSEHOLD: {
    title: 'Household Essentials',
    subtitle: 'Keep your home fresh',
  },
} as const;
