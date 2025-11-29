/**
 * Application-wide constants
 */

export const APP_NAME = 'Grocery Booking App';
export const APP_VERSION = '0.1.0';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_SESSION: 'auth_session',
  AUTO_LOGOUT_TIME: 'auto_logout_time',
  HAS_VISITED: 'has_visited',
} as const;

// Default values
export const DEFAULT_AUTO_LOGOUT_TIME = 10; // minutes

// Time formats
export const TIME_FORMATS = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm A',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
} as const;

// API endpoints (if needed in future)
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  AUTH: '/api/auth',
} as const;
