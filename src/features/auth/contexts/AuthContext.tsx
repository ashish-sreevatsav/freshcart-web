import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  autoLogoutTime: number;
  setAutoLogoutTime: (minutes: number) => void;
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
  const [autoLogoutTime, setAutoLogoutTimeState] = useState(() => {
    const saved = localStorage.getItem(LOGOUT_TIME_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_LOGOUT_TIME;
  });
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        try {
          const { username, loginTime } = JSON.parse(session);
          const now = Date.now();
          const elapsed = (now - loginTime) / 1000 / 60; // minutes

          if (elapsed < autoLogoutTime) {
            setIsAuthenticated(true);
            // Start auto-logout timer for remaining time
            const remainingTime = (autoLogoutTime - elapsed) * 60 * 1000;
            startLogoutTimer(remainingTime);
          } else {
            // Session expired
            logout();
          }
        } catch (error) {
          console.error('Error parsing session:', error);
          logout();
        }
      }
    };

    checkSession();
  }, []);

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

  const login = (username: string) => {
    const session = {
      username,
      loginTime: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setIsAuthenticated(true);
    
    // Start auto-logout timer
    startLogoutTimer();
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      setLogoutTimer(null);
    }
  };

  const setAutoLogoutTime = (minutes: number) => {
    setAutoLogoutTimeState(minutes);
    localStorage.setItem(LOGOUT_TIME_KEY, minutes.toString());
    
    // If user is logged in, restart the timer with new duration
    if (isAuthenticated) {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const { username } = JSON.parse(session);
        // Update login time to now
        login(username);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        autoLogoutTime,
        setAutoLogoutTime,
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
