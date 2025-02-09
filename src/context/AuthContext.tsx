import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Use different endpoints for admin and user authentication
        const endpoint = isAdminRoute ? '/api/auth/admin/me' : '/api/auth/me';
        const response = await fetch(`http://localhost:5000${endpoint}`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log('Auth check response:', userData); // Debug log
          setUser(userData);
          
          // Redirect if trying to access admin routes without admin role
          if (isAdminRoute && userData.role !== 'admin') {
            navigate('/');
          }
        } else {
          if (isAdminRoute && location.pathname !== '/admin/login') {
            navigate('/admin/login');
          }
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        if (isAdminRoute && location.pathname !== '/admin/login') {
          navigate('/admin/login');
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const isAdminLogin = location.pathname === '/admin/login';
      
      // Use different endpoints for admin and user login
      const endpoint = isAdminLogin ? '/api/auth/admin/login' : '/api/auth/login';
      console.log('Attempting login at:', endpoint); // Debug log
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data); // Debug log
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data);

      if (isAdminLogin) {
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          throw new Error('Unauthorized access');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Use different endpoints for admin and user logout
      const endpoint = isAdminRoute ? '/api/auth/admin/logout' : '/api/auth/logout';
      await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      if (isAdminRoute) {
        navigate('/admin/login');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading, error, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}