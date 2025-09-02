import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Effect to run on initial app load
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Check if token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({
            username: decodedToken.sub, // 'sub' is the standard claim for subject (username)
            roles: decodedToken.roles || [], // Assuming roles are in the token
          });
          // Set the token in the api header for subsequent requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // Token is expired
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  // Login function
  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { token: newToken, username: loggedInUsername, roles } = response.data;
    
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser({ username: loggedInUsername, roles });
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  };

  // Register Company function
  const registerCompany = async (companyData) => {
    // companyData should be an object like { companyName, adminUsername, ... }
    return await api.post('/auth/register-company', companyData);
  };
  
  // The value provided to consuming components
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    registerCompany,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy consumption
export const useAuth = () => {
  return useContext(AuthContext);
};