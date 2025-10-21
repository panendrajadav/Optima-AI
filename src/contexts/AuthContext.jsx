import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Demo password for all @optima.ai users
  const DEMO_PASSWORD = 'demo123';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const savedUser = localStorage.getItem('optima-user');
      const sessionExpiry = localStorage.getItem('optima-session-expiry');
      
      if (savedUser && sessionExpiry) {
        const now = new Date().getTime();
        if (now < parseInt(sessionExpiry)) {
          setUser(JSON.parse(savedUser));
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    // Input validation
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }
    
    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email ends with @optima.ai and password matches
    if (email.toLowerCase().endsWith('@optima.ai') && password === DEMO_PASSWORD) {
      // Extract name from email (part before @optima.ai)
      const nameFromEmail = email.split('@')[0];
      const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      
      const userData = { 
        email: email.toLowerCase(), 
        name: displayName, 
        role: 'user',
        loginTime: new Date().toISOString(),
        sessionId: Math.random().toString(36).substring(2, 15)
      };
      
      // Set session expiry (24 hours)
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
      
      setUser(userData);
      localStorage.setItem('optima-user', JSON.stringify(userData));
      localStorage.setItem('optima-session-expiry', expiryTime.toString());
      
      return { success: true, user: userData };
    }
    
    return { success: false, error: 'Invalid email or password. Use format: name@optima.ai with password: demo123' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('optima-user');
    localStorage.removeItem('optima-session-expiry');
  };
  
  // Auto-logout on session expiry
  useEffect(() => {
    if (user) {
      const checkSession = () => {
        const sessionExpiry = localStorage.getItem('optima-session-expiry');
        if (sessionExpiry && new Date().getTime() > parseInt(sessionExpiry)) {
          logout();
        }
      };
      
      const interval = setInterval(checkSession, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  const isAuthenticated = () => !!user;

  const hasRole = (role) => user?.role === role;

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};