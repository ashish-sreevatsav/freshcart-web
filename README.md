# Fresh Cart - Grocery Booking App

A modern, responsive grocery e-commerce application built with React, TypeScript, and Vite. Features a feature-based architecture following industry best practices for scalability and maintainability.

## 🌟 Overview

Fresh Cart is a full-featured grocery shopping application that provides users with a seamless online shopping experience. Built with modern web technologies, it offers an intuitive interface optimized for all devices.

### Key Features

- 🏠 **Product Catalog**: Browse products by categories with promotional banners
- 🛒 **Shopping Cart**: Real-time cart management with quantity controls
- 👤 **User Authentication**: Secure login and registration system
- 📦 **Order Management**: Track current and past orders with detailed queries
- 💳 **Checkout & Billing**: Complete billing and payment functionality
- ⚙️ **Profile & Settings**: Manage user preferences and account details
- 📱 **Responsive Design**: Mobile-first design with bottom navigation
- 🎨 **Theme Support**: Light/dark mode with persistent preferences
- 🎯 **Type-Safe**: Full TypeScript coverage for reliability

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fresh-cart

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`

## 🏗️ Project Architecture

### Feature-Based Structure

The application follows a feature-based architecture where each feature is self-contained with its own components, hooks, contexts, and business logic.

```
src/
├── types/                      # TypeScript type definitions
│   ├── auth.types.ts          # Authentication types
│   ├── product.types.ts       # Product & cart types
│   ├── order.types.ts         # Order & query types
│   ├── navigation.types.ts    # Navigation types
│   └── index.ts               # Centralized exports
│
├── features/                   # Feature modules
│   ├── auth/                  # Authentication
│   │   ├── components/        # LoginPage, RegisterPage, SplashScreen
│   │   ├── contexts/          # AuthContext with useAuth hook
│   │   └── index.ts
│   ├── cart/                  # Shopping cart
│   │   ├── components/        # Cart, CheckoutModal
│   │   ├── hooks/             # useCart hook
│   │   └── index.ts
│   ├── products/              # Product catalog
│   │   ├── components/        # HomePage, ProductCard, ProductGrid, etc.
│   │   ├── data/              # Mock product data
│   │   └── index.ts
│   ├── orders/                # Order management
│   │   ├── components/        # OrdersPage
│   │   ├── hooks/             # useOrders hook
│   │   └── index.ts
│   ├── profile/               # User profile
│   │   ├── components/        # ProfilePage, SettingsPage
│   │   └── index.ts
│   └── billing/               # Billing & payments
│       ├── components/        # BillingPage
│       └── index.ts
│
├── shared/                     # Shared resources
│   ├── components/
│   │   ├── ui/                # 50+ Radix UI components
│   │   ├── common/            # Common components (ImageWithFallback)
│   │   └── index.ts
│   ├── contexts/              # ThemeContext
│   ├── hooks/                 # Shared custom hooks
│   └── utils/                 # Utility functions
│       ├── helpers.ts         # formatPrice, formatDate, etc.
│       ├── validation.ts      # Email, phone validation
│       └── index.ts
│
├── layouts/                    # Layout components
│   ├── Header.tsx
│   ├── BottomNav.tsx
│   └── index.ts
│
├── core/                       # Core configuration
│   ├── constants/
│   │   ├── app.constants.ts
│   │   ├── product.constants.ts
│   │   └── index.ts
│   └── config/
│
├── assets/                     # Static assets
│   └── images/
│
├── styles/                     # Global styles
│   └── globals.css
│
├── App.tsx                     # Main app component
├── MainRouter.tsx              # Route management
├── main.tsx                    # App entry point
└── index.css                   # Global styles
```

## 🛠️ Tech Stack

### Core
- **React** 18.3.1 - UI library
- **TypeScript** - Type-safe development
- **Vite** 6.3.5 - Build tool and dev server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** 0.487.0 - Icon library
- **class-variance-authority** 0.7.1 - Component variants
- **clsx** & **tailwind-merge** - Conditional styling

### Additional Libraries
- **React Hook Form** 7.55.0 - Form management
- **React Day Picker** 8.10.1 - Date picker
- **Embla Carousel** 8.6.0 - Carousel/slider
- **Recharts** 2.15.2 - Data visualization
- **Sonner** 2.0.3 - Toast notifications
- **next-themes** 0.4.6 - Theme management
- **Vaul** 1.1.2 - Drawer component
- **cmdk** 1.1.1 - Command menu

## 📝 Development Guide

### Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
// Instead of relative paths
import { Product } from '../../../types/product.types';

// Use clean aliases
import { Product } from '@/types';
import { useAuth } from '@/features/auth';
import { Button } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils';
import { STORAGE_KEYS } from '@/core/constants';
```

### Available Aliases
- `@/*` → `src/*`
- `@/types` → `src/types`
- `@/features/*` → `src/features/*`
- `@/shared/*` → `src/shared/*`
- `@/core/*` → `src/core/*`
- `@/layouts/*` → `src/layouts/*`
- `@/assets/*` → `src/assets/*`

### Component Template

```typescript
import { useState } from 'react';
import { YourType } from '@/types';
import { Button } from '@/shared/components/ui';

interface YourComponentProps {
  prop1: string;
  prop2?: number;
}

export function YourComponent({ prop1, prop2 }: YourComponentProps) {
  const [state, setState] = useState();

  const handleClick = () => {
    // Handler logic
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Custom Hook Template

```typescript
import { useState, useCallback } from 'react';
import { YourType } from '@/types';

export const useYourHook = () => {
  const [state, setState] = useState<YourType>();

  const action = useCallback(() => {
    // Business logic
  }, []);

  return { state, action };
};
```

### Adding a New Feature

1. Create feature folder: `src/features/your-feature/`
2. Add components: `components/YourComponent.tsx`
3. Add hooks (optional): `hooks/useYourFeature.ts`
4. Add types in: `src/types/your-feature.types.ts`
5. Export from: `index.ts`

```typescript
// features/your-feature/index.ts
export { YourComponent } from './components/YourComponent';
export { useYourFeature } from './hooks/useYourFeature';
```

## 🎨 Styling Guidelines

- Use Tailwind CSS utility classes for styling
- Component variants with `class-variance-authority`
- Theme support via `ThemeContext`
- Responsive design with Tailwind breakpoints
- Shared UI components from `@/shared/components/ui`

## 🧪 Code Quality

### File Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCart.ts`)
- **Utils**: camelCase (e.g., `helpers.ts`)
- **Types**: camelCase with `.types` suffix (e.g., `product.types.ts`)
- **Constants**: camelCase with `.constants` suffix (e.g., `app.constants.ts`)

### Import Order
1. External libraries (React, etc.)
2. Type imports from `@/types`
3. Feature imports from `@/features/*`
4. Shared imports from `@/shared/*`
5. Layout imports from `@/layouts/*`
6. Relative imports

## 📚 Feature Documentation

### Authentication (`features/auth`)
- **Components**: `LoginPage`, `RegisterPage`, `SplashScreen`
- **Context**: `AuthContext` with `useAuth` hook
- **Types**: `User`, `AuthContextType`

```typescript
import { useAuth, LoginPage } from '@/features/auth';
const { user, login, logout } = useAuth();
```

### Shopping Cart (`features/cart`)
- **Components**: `Cart`, `CheckoutModal`
- **Hook**: `useCart` for cart management
- **Types**: `CartItem`

```typescript
import { useCart, Cart } from '@/features/cart';
const { items, addItem, removeItem, total } = useCart();
```

### Products (`features/products`)
- **Components**: `HomePage`, `ProductCard`, `ProductGrid`, `CategoryRow`, `AdBanner`, `CelebrityPromo`
- **Data**: `PRODUCTS` mock data
- **Types**: `Product`

```typescript
import { HomePage, ProductCard, PRODUCTS } from '@/features/products';
```

### Orders (`features/orders`)
- **Components**: `OrdersPage`
- **Hook**: `useOrders` for order management
- **Types**: `Order`, `Query`

```typescript
import { useOrders, OrdersPage } from '@/features/orders';
const { orders, queries, createOrder } = useOrders();
```

### Profile (`features/profile`)
- **Components**: `ProfilePage`, `SettingsPage`

```typescript
import { ProfilePage, SettingsPage } from '@/features/profile';
```

### Billing (`features/billing`)
- **Components**: `BillingPage`

```typescript
import { BillingPage } from '@/features/billing';
```

## 🔧 Utility Functions

### Helpers (`shared/utils/helpers.ts`)
- `formatPrice(price: number)` - Format currency
- `formatDate(date: Date)` - Format dates
- `calculateDiscount(price, discount)` - Calculate discounts
- `debounce(fn, delay)` - Debounce function

### Validation (`shared/utils/validation.ts`)
- `isValidEmail(email: string)` - Email validation
- `isValidPhone(phone: string)` - Phone validation
- `isValidZipCode(zip: string)` - Zip code validation

```typescript
import { formatPrice, isValidEmail } from '@/shared/utils';
```

## 📦 Build Information

Production build output:
```
✓ 1633 modules transformed
✓ Built in 2.70s
  - index.html: 0.43 kB (gzip: 0.28 kB)
  - CSS: 36.20 kB (gzip: 6.43 kB)
  - JS: 252.97 kB (gzip: 68.76 kB)
```

**Status**: ✅ Production Ready

## 🔍 Scripts

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

## 🚀 Future Enhancements

Consider implementing:
1. **State Management**: Redux Toolkit or Zustand
2. **API Integration**: REST or GraphQL with Axios
3. **Testing**: Jest + React Testing Library
4. **Error Boundaries**: Global error handling
5. **Code Splitting**: Lazy loading for better performance
6. **Storybook**: Component documentation
7. **CI/CD Pipeline**: Automated deployment
8. **i18n**: Multi-language support
9. **PWA**: Progressive Web App capabilities
10. **Analytics**: User behavior tracking

## 📄 License

Private

## 🤝 Contributing

1. Follow the established folder structure
2. Use TypeScript strictly with proper types
3. Keep components small and focused
4. Use custom hooks for reusable business logic
5. Write descriptive comments for complex logic
6. Test your changes before committing

---

**Version**: 0.1.0  
**Last Updated**: November 29, 2025

