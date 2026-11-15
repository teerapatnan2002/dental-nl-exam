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
    const withAuth = (tok) => {
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };
      if (tok) {
        headers['Authorization'] = `Bearer ${tok}`;
      }
      return {
        ...options,
        headers,
      };
    };

    let res = await fetch(url, withAuth(token));
    if (res.status === 401 && token && refreshToken) {
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

  const extractErrorMessage = (data, fallback) => {
    if (Array.isArray(data?.detail)) {
      return data.detail.map(e => e.msg).join(', ');
    }
    return data?.detail || fallback;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(extractErrorMessage(data, 'Login failed'));
    }
    if (data.requires_2fa && data.challenge_token) {
      return { requires2fa: true, challengeToken: data.challenge_token };
    }
    setToken(data.access_token);
    if (data.refresh_token) setRefreshToken(data.refresh_token);
    return { requires2fa: false };
  };

  const verifyTwoFactorLogin = async (challengeToken, code) => {
    const res = await fetch(`${API_BASE}/api/auth/2fa/verify-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challenge_token: challengeToken, code })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(extractErrorMessage(data, 'รหัสยืนยัน 2FA ไม่ถูกต้อง'));
    }
    setToken(data.access_token);
    if (data.refresh_token) setRefreshToken(data.refresh_token);
    return data;
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

  const updateProfile = async (payload) => {
    const res = await authFetch(`${API_BASE}/api/auth/profile`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      if (Array.isArray(data.detail)) {
        throw new Error(data.detail.map(e => e.msg).join(', '));
      }
      throw new Error(data.detail || 'ไม่สามารถอัปเดตข้อมูลโปรไฟล์ได้');
    }
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
    }
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
      setRefreshToken(data.refresh_token);
    }
    setUser(data);
    return data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await authFetch(`${API_BASE}/api/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(extractErrorMessage(data, 'ไม่สามารถเปลี่ยนรหัสผ่านได้'));
    }
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
    }
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
      setRefreshToken(data.refresh_token);
    }
    return data;
  };

  const setupTwoFactor = async () => {
    const res = await authFetch(`${API_BASE}/api/auth/2fa/setup`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(extractErrorMessage(data, 'ไม่สามารถสร้าง QR ตั้งค่า 2FA ได้'));
    }
    return data;
  };

  const enableTwoFactor = async (code) => {
    const res = await authFetch(`${API_BASE}/api/auth/2fa/enable`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(extractErrorMessage(data, 'รหัสยืนยัน 6 หลักไม่ถูกต้อง'));
    }
    setUser(prev => prev ? {
      ...prev,
      two_factor_enabled: true,
      two_factor_enabled_at: data.enabled_at ?? prev.two_factor_enabled_at,
      two_factor_backup_remaining: data.backup_codes_remaining ?? 8,
    } : prev);
    await fetchCurrentUser();
    return data;
  };

  const disableTwoFactor = async (currentPassword, code) => {
    const res = await authFetch(`${API_BASE}/api/auth/2fa/disable`, {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(extractErrorMessage(data, 'ไม่สามารถปิดใช้งาน 2FA ได้'));
    }
    setUser(prev => prev ? {
      ...prev,
      two_factor_enabled: false,
      two_factor_enabled_at: null,
      two_factor_backup_remaining: 0,
    } : prev);
    await fetchCurrentUser();
    return data;
  };

  const regenerateBackupCodes = async (code) => {
    const res = await authFetch(`${API_BASE}/api/auth/2fa/backup-codes/regenerate`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(extractErrorMessage(data, 'ไม่สามารถออกรหัสสำรองชุดใหม่ได้'));
    }
    setUser(prev => prev ? {
      ...prev,
      two_factor_backup_remaining: data.backup_codes_remaining ?? 8,
    } : prev);
    await fetchCurrentUser();
    return data;
  };

  const logout = () => {
    clearTokens();
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      verifyTwoFactorLogin,
      register,
      logout,
      authFetch,
      updateProfile,
      changePassword,
      setupTwoFactor,
      enableTwoFactor,
      disableTwoFactor,
      regenerateBackupCodes,
      refreshUser: fetchCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);