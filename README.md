# 🛒 FreshCart Frontend

A modern, responsive grocery shopping web application built with React, TypeScript, and Vite.

## 📖 About

FreshCart is a full-featured grocery e-commerce web application that provides users with a seamless online shopping experience. The application features user authentication, product browsing, shopping cart management, order processing, and profile management—all synchronized with a backend API.

## 🌟 Features

- **User Authentication** - Secure JWT-based login and registration
- **Product Catalog** - Browse products from database with real-time updates
- **Shopping Cart** - Backend-synchronized cart with persistent storage
- **Order Management** - Create and track orders with complete history
- **Profile Management** - Update profile information and manage addresses
- **Responsive Design** - Mobile-first design optimized for all devices
- **Search & Filter** - Find products quickly with advanced filters
- **Featured Deals** - Display daily deals and special offers

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation & Run

```bash
# Clone the repository
git clone <repository-url>
cd fresh-cart

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL=http://localhost:5001

# Run development server
npm run dev
```

The application will be available at **http://localhost:5173**

### Default Login Credentials

After backend is seeded:
- **Email**: admin@freshcart.com
- **Password**: admin123

## 📦 Production Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

The production build will be in the `build` directory and can be deployed to:
- Vercel
- Netlify  
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

## 🏗️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library

## 📚 Documentation

For detailed documentation, see the parent `mark3` folder:
- **Setup Guide**: `../QUICK_START.md`
- **Integration Details**: `../BACKEND_INTEGRATION.md`
- **Testing Guide**: `../TESTING_CHECKLIST.md`
- **Integration Summary**: `../INTEGRATION_SUMMARY.md`

## 📄 License

MIT License

