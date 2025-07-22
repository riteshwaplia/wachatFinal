import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Improved setAuthData with persistence
    const setAuthData = useCallback((userData, authToken) => {
        console.log("[setAuthData] Setting:", { userData, authToken });
        
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
                setLoading(false);
                return;
            }
            
            try {
                const response = await api.get('/users/profile');
                console.log("Profile response:", response.data);
                setAuthData(response.data, token); // Adjust based on actual response
            } catch (err) {
                console.error('Auth verification failed:', err);
                setAuthData(null, null);
                setError('Session expired. Please login again.');
            } finally {
                setLoading(false);
            }
        };
        
        verifyAuth();
    }, [token, setAuthData]);

    // Improved login function
const login = async (email, password) => {
  setLoading(true);
  setError(null);

  try {
    const response = await api.post('/users/login', { email, password });
    console.log("Login response:", response);
    console.log("response data:", response.data);

    let userData, authToken;

    // ✅ Corrected response structure
    if (response.data?.token && response.data?._id) {
      const { token, ...user } = response.data;
      userData = user;
      authToken = token;
    } else {
      throw new Error('Unexpected response format from server');
    }

    setAuthData(userData, authToken);
    return { success: true, user: userData };

  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    console.error('Login failed:', errorMsg);
    setError(errorMsg);
    return { success: false, error: errorMsg };
  } finally {
    setLoading(false);
  }
};




    const authState = {
        user,
        token,
        isLoggedIn: !!user && !!token,
        loading,
        error,
        login,
        logout: () => setAuthData(null, null),
        register: async (username, email, password) => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.post('/users/register', { username, email, password });
                console.log("Registration response:", response.data);
                
                // Handle response same as login
                let userData, authToken;
                
                if (response.data.token && response.data._id) {
                    const { token, ...rest } = response.data;
                    userData = rest;
                    authToken = token;
                } else if (response.data.user && response.data.token) {
                    userData = response.data.user;
                    authToken = response.data.token;
                }
                
                setAuthData(userData, authToken);
                return { success: true };
            } catch (err) {
                const errorMsg = err.response?.data?.message || err.message;
                console.error('Registration failed:', errorMsg);
                setError(errorMsg);
                return { success: false, error: errorMsg };
            } finally {
                setLoading(false);
            }
        }
    };

    // Debugging effect
    useEffect(() => {
        console.log("Auth state updated:", {
            user: authState.user,
            token: authState.token,
            isLoggedIn: authState.isLoggedIn
        });
    }, [authState.user, authState.token]);

    return (
        <AuthContext.Provider value={authState}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};