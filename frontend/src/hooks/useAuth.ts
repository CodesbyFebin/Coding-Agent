import { useState, useEffect } from 'react';

// Auth state interface
interface AuthState {
  user: {
    id: string;
    email: string;
    username: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Mock auth functions (will be replaced with real API calls)
const mockLogin = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful login
  return {
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: '1',
      email: email,
      username: email.split('@')[0]
    }
  };
};

const mockRegister = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful registration
  return {
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: '2',
      email: email,
      username: email.split('@')[0]
    }
  };
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true
  });

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would check localStorage or make an API call
        const token = localStorage.getItem('token');
        const userJson = localStorage.getItem('user');
        
        if (token && userJson) {
          const user = JSON.parse(userJson);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            loading: false
          });
        } else {
          setAuthState(prev => ({
            ...prev,
            loading: false
          }));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false
        }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const result = await mockLogin(email, password);
      
      // Save to localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      setAuthState({
        user: result.user,
        token: result.token,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false
      }));
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const result = await mockRegister(email, password);
      
      // Save to localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      setAuthState({
        user: result.user,
        token: result.token,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false
      }));
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false
    });
  };

  return {
    ...authState,
    login,
    register,
    logout
  };
};
