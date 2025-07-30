import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import api from '../utils/api';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [globalLoading, setGlobalLoading] = useState(true); // loading on app start
  const [authLoading, setAuthLoading] = useState(false); // for login/register
  const [error, setError] = useState(null);

  const setAuthData = useCallback((userData, authToken) => {
    console.log('[setAuthData] Setting:', { userData, authToken });

    if (authToken) {
      localStorage.setItem('authToken', authToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
    }

    setUser(userData);
    setToken(authToken);
  }, []);

  // Verify auth on initial load
  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setGlobalLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/profile');
        console.log('Profile response:', response.data);
        setAuthData(response.data, token);
      } catch (err) {
        console.error('Auth verification failed:', err);
        setAuthData(null, null);
        navigate('/login');
        setError('Session expired. Please login again.');
      } finally {
        setGlobalLoading(false);
      }
    };

    verifyAuth();
  }, [token, setAuthData]);

  // Login
  const login = async (email, password) => {
    setAuthLoading(true);
    setError(null);

    try {
      const response = await api.post('/users/login', { email, password });
      console.log('Login response:', response);

      if (response.data?.token && response.data?._id) {
        const { token, ...user } = response.data;
        setAuthData(user, token);
        return { success: true, user };
      } else {
        throw new Error('Unexpected response format from server');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error('Login failed:', errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setAuthLoading(true);
    setError(null);

    try {
      const response = await api.post('/users/register', {
        username,
        email,
        password,
      });

      if (response.data.token && response.data._id) {
        const { token, ...user } = response.data;
        setAuthData(user, token);
        return { success: true };
      } else if (response.data.user && response.data.token) {
        setAuthData(response.data.user, response.data.token);
        return { success: true };
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error('Registration failed:', errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
    } catch (err) {
      console.warn('Backend logout failed:', err.message);
    } finally {
      setAuthData(null, null);
      navigate('/login');
    }
  };

  // Show global spinner only once on app startup
  if (globalLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!user && !!token,
        authLoading, // used in LoginPage
        error,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
