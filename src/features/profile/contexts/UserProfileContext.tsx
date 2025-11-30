import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Address, PaymentMethod, UserProfile, AddressCategory, PaymentMethodType } from '@/types';

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  
  // Address methods
  addresses: Address[];
  defaultAddress: Address | null;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  
  // Payment methods
  paymentMethods: PaymentMethod[];
  defaultPaymentMethod: PaymentMethod | null;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = 'user_profile';

interface UserProfileProviderProps {
  children: ReactNode;
}

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing profile:', error);
      }
    }
    // Default profile
    return {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      addresses: [
        {
          id: '1',
          name: 'John Doe',
          phone: '+1 (555) 123-4567',
          address: '123 Main St',
          city: 'New York',
          zipCode: '10001',
          category: 'home',
          isDefault: true,
        },
      ],
      paymentMethods: [
        {
          id: '1',
          type: 'visa',
          cardholderName: 'John Doe',
          last4: '4242',
          expiryDate: '12/25',
          isDefault: true,
        },
      ],
    };
  });

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  // Address methods
  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
      isDefault: profile.addresses.length === 0 ? true : address.isDefault,
    };

    setProfile(prev => ({
      ...prev,
      addresses: address.isDefault
        ? [...prev.addresses.map(a => ({ ...a, isDefault: false })), newAddress]
        : [...prev.addresses, newAddress],
    }));
  };

  const updateAddress = (id: string, addressUpdate: Partial<Address>) => {
    setProfile(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr =>
        addr.id === id ? { ...addr, ...addressUpdate } : addr
      ),
    }));
  };

  const deleteAddress = (id: string) => {
    setProfile(prev => {
      const filtered = prev.addresses.filter(addr => addr.id !== id);
      // If deleted address was default and there are remaining addresses, set first as default
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return { ...prev, addresses: filtered };
    });
  };

  const setDefaultAddress = (id: string) => {
    setProfile(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    }));
  };

  // Payment methods
  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: Date.now().toString(),
      isDefault: profile.paymentMethods.length === 0 ? true : method.isDefault,
    };

    setProfile(prev => ({
      ...prev,
      paymentMethods: method.isDefault
        ? [...prev.paymentMethods.map(m => ({ ...m, isDefault: false })), newMethod]
        : [...prev.paymentMethods, newMethod],
    }));
  };

  const updatePaymentMethod = (id: string, methodUpdate: Partial<PaymentMethod>) => {
    setProfile(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(method =>
        method.id === id ? { ...method, ...methodUpdate } : method
      ),
    }));
  };

  const deletePaymentMethod = (id: string) => {
    setProfile(prev => {
      const filtered = prev.paymentMethods.filter(method => method.id !== id);
      // If deleted method was default and there are remaining methods, set first as default
      if (filtered.length > 0 && !filtered.some(m => m.isDefault)) {
        filtered[0].isDefault = true;
      }
      return { ...prev, paymentMethods: filtered };
    });
  };

  const setDefaultPaymentMethod = (id: string) => {
    setProfile(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id,
      })),
    }));
  };

  const defaultAddress = profile.addresses.find(a => a.isDefault) || null;
  const defaultPaymentMethod = profile.paymentMethods.find(m => m.isDefault) || null;

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        updateProfile,
        addresses: profile.addresses,
        defaultAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        paymentMethods: profile.paymentMethods,
        defaultPaymentMethod,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        setDefaultPaymentMethod,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
