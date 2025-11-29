/**
 * Authentication related type definitions
 */

export interface User {
  username: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  autoLogoutTime: number;
  setAutoLogoutTime: (minutes: number) => void;
}

export interface AuthSession {
  username: string;
  loginTime: number;
}
