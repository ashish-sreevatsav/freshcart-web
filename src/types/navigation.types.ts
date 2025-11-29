/**
 * Navigation and routing type definitions
 */

export type PageType = 'home' | 'orders' | 'billing' | 'profile';

export interface NavigationItem {
  id: PageType;
  label: string;
  icon: string;
}
