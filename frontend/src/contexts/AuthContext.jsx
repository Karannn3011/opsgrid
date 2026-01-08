import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({
            username: decodedToken.sub,
            roles: decodedToken.roles || [],
            // Added: Capture company name from token claims if available
            companyName: decodedToken.companyName || decodedToken.company || "OPSGRID LOGISTICS",
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
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

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    // Added: Destructure companyName from response
    const { token: newToken, username: loggedInUsername, roles, companyName } = response.data;
    
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    // Updated: Include companyName in user state
    setUser({ 
      username: loggedInUsername, 
      roles,
      companyName: companyName || "OPSGRID LOGISTICS" // Fallback if backend doesn't send it yet
    });
    
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const registerCompany = async (companyData) => {
    return await api.post('/auth/register-company', companyData);
  };
  
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

export const useAuth = () => {
  return useContext(AuthContext);
};