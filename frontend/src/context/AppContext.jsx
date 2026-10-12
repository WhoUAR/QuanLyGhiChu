import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [profile, setProfile] = useState({
    displayName: 'Sinh viên',
    theme: 'light',
    primaryColor: '#2563eb',
    password: '123'
  });
  const [loading, setLoading] = useState(true);

  // Lấy cấu hình profile từ Backend khi khởi động
  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.warn('Không kết nối được Backend, dùng cấu hình mặc định.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Áp dụng màu trang web trắng hay đen, và các màu của button
  useEffect(() => {
    const isDark = profile.theme === 'dark';
    document.documentElement.setAttribute('data-theme', profile.theme);
    document.documentElement.style.setProperty('--primary-color', profile.primaryColor || '#2563eb');
    if (isDark) {
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f8fafc';
    } else {
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [profile.theme, profile.primaryColor]);

  return (
    <AppContext.Provider value={{ profile, setProfile, fetchProfile, loading }}>
      {children}
    </AppContext.Provider>
  );
}
