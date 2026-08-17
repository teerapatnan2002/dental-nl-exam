import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchCurrentUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    } else {
      localStorage.removeItem('refresh_token');
    }
  }, [refreshToken]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else if (res.status === 401 && refreshToken) {
        // Access token expired — try refreshing silently
        const ok = await doRefresh();
        if (!ok) clearTokens();
      } else {
        clearTokens();
      }
    } catch (err) {
      console.error('Failed to fetch user', err);
    } finally {
      setLoading(false);
    }
  };

  const doRefresh = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      if (!res.ok) return false;
      const data = await res.json();
      setToken(data.access_token);
      if (data.refresh_token) setRefreshToken(data.refresh_token);
      return true;
    } catch {
      return false;
    }
  };

  const clearTokens = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  /**
   * fetch wrapper that attaches the access token and automatically
   * refreshes it once on 401 before retrying the request.
   */
  const authFetch = useCallback(async (url, options = {}) => {
    const withAuth = (tok) => ({
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        'Authorization': `Bearer ${tok}`,
      },
    });

    let res = await fetch(url, withAuth(token));
    if (res.status === 401 && refreshToken) {
      const ok = await doRefresh();
      if (ok) {
        const newTok = localStorage.getItem('token');
        res = await fetch(url, withAuth(newTok));
      } else {
        clearTokens();
      }
    }
    return res;
  }, [token, refreshToken]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      if (Array.isArray(data.detail)) {
        throw new Error(data.detail.map(e => e.msg).join(', '));
      }
      throw new Error(data.detail || 'Login failed');
    }
    setToken(data.access_token);
    if (data.refresh_token) setRefreshToken(data.refresh_token);
  };

  const register = async (email, username, password) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      if (Array.isArray(data.detail)) {
        throw new Error(data.detail.map(e => e.msg).join(', '));
      }
      throw new Error(data.detail || 'Registration failed');
    }
    await login(email, password);
  };

  const logout = () => {
    clearTokens();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);