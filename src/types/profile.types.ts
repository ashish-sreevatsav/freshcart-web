/**
 * Profile, Address and Payment related type definitions
 */

export type AddressCategory = 'home' | 'office' | 'other';

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  category: AddressCategory;
  isDefault: boolean;
}

export type PaymentMethodType = 'visa' | 'mastercard' | 'amex';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  cardholderName: string;
  last4: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}
