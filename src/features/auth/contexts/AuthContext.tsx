import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, type AuthResponse, type UserProfile } from '@/core/services';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  autoLogoutTime: number;
  setAutoLogoutTime: (minutes: number) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'auth_session';
const LOGOUT_TIME_KEY = 'auto_logout_time';
const DEFAULT_LOGOUT_TIME = 10; // 10 minutes in minutes

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [autoLogoutTime, setAutoLogoutTimeState] = useState(() => {
    const saved = localStorage.getItem(LOGOUT_TIME_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_LOGOUT_TIME;
  });
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('auth_token');
      const session = localStorage.getItem(SESSION_KEY);
      
      if (token && session) {
        try {
          const { loginTime } = JSON.parse(session);
          const now = Date.now();
          const elapsed = (now - loginTime) / 1000 / 60; // minutes

          if (elapsed < autoLogoutTime) {
            // Verify token is still valid by fetching user profile
            const userProfile = await authService.getMe();
            setUser(userProfile);
            setIsAuthenticated(true);
            
            // Start auto-logout timer for remaining time
            const remainingTime = (autoLogoutTime - elapsed) * 60 * 1000;
            startLogoutTimer(remainingTime);
          } else {
            // Session expired
            logout();
          }
        } catch (error) {
          console.error('Error validating session:', error);
          logout();
        }
      }
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const startLogoutTimer = (timeInMs?: number) => {
    // Clear existing timer
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    // Set new timer
    const timeout = timeInMs || autoLogoutTime * 60 * 1000; // Convert minutes to milliseconds
    const timer = setTimeout(() => {
      logout();
      alert('Your session has expired. Please login again.');
    }, timeout);

    setLogoutTimer(timer);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      const session = {
        userId: response.user.id,
        loginTime: Date.now(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      
      setUser({
        _id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        phone: response.user.phone,
        addresses: [],
        createdAt: new Date().toISOString(),
      });
      setIsAuthenticated(true);
      
      // Start auto-logout timer
      startLogoutTimer();
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    try {
      const response = await authService.register({ name, email, password, phone });
      
      const session = {
        userId: response.user.id,
        loginTime: Date.now(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      
      setUser({
        _id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        phone: response.user.phone,
        addresses: [],
        createdAt: new Date().toISOString(),
      });
      setIsAuthenticated(true);
      
      // Start auto-logout timer
      startLogoutTimer();
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setUser(null);
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      setLogoutTimer(null);
    }
  };

  const refreshUser = async () => {
    try {
      const userProfile = await authService.getMe();
      setUser(userProfile);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const setAutoLogoutTime = (minutes: number) => {
    setAutoLogoutTimeState(minutes);
    localStorage.setItem(LOGOUT_TIME_KEY, minutes.toString());
    
    // If user is logged in, restart the timer with new duration
    if (isAuthenticated) {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const { userId } = JSON.parse(session);
        // Update login time to now
        const newSession = {
          userId,
          loginTime: Date.now(),
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
        startLogoutTimer();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        autoLogoutTime,
        setAutoLogoutTime,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
