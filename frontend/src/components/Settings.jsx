import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Settings() {
  const { profile, setProfile } = useContext(AppContext);
  const [formData, setFormData] = useState({
    displayName: '',
    theme: 'light',
    primaryColor: '#2563eb',
    password: ''
  });
  const [toastMessage, setToastMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        theme: profile.theme || 'light',
        primaryColor: profile.primaryColor || '#2563eb',
        password: profile.password || ''
      });
    }
  }, [profile]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Nếu đổi theme hoặc màu chủ đạo
    if (name === 'theme' || name === 'primaryColor') {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleColorSelect = (color) => {
    const updated = { ...formData, primaryColor: color };
    setFormData(updated);
    setProfile((prev) => ({ ...prev, primaryColor: color }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfile(formData);
        showToast(' Đã lưu cấu hình vào data/profile.json thành công!');
      } else {
        alert('Lỗi cập nhật cấu hình: ' + (data.message || 'Lỗi server'));
      }
    } catch (err) {
      alert('Không thể kết nối đến máy chủ Backend.');
    } finally {
      setSaving(false);
    }
  };

  const colorPresets = [
    { label: 'Xanh Lam (Mặc định)', value: '#2563eb' },
    { label: 'Xanh Lá', value: '#10b981' },
    { label: 'Cam Năng Động', value: '#f97316' },
    { label: 'Tím Hiện Đại', value: '#8b5cf6' },
    { label: 'Đỏ Thẫm', value: '#ef4444' }
  ];

  return (
    <div className="page-container">
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Cài đặt</h1>
          <p className="page-desc">Tùy biến hiển thị và quản lý mã khóa bảo vệ thông tin cá nhân.</p>
        </div>
      </div>

      <div className="card settings-card">
        <form onSubmit={handleSave}>
          {/* Cài đặt thông tin cá nhân */}
          <div className="settings-section">
            <h3 className="section-title"> Thông tin hiển thị</h3>
            <div className="form-group">
              <label className="form-label">Tên hiển thị người dùng</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="VD: Nguyễn Văn A..."
                className="input-control"
                required
              />
              <span className="form-hint">Tên này sẽ hiển thị ở thanh điều hướng bên trái và các tiêu đề.</span>
            </div>
          </div>

          <hr className="divider" />

          {/* Cài đặt giao diện Theme */}
          <div className="settings-section">
            <h3 className="section-title"> Giao diện</h3>
            
            <div className="form-group">
              <label className="form-label">Chế độ giao diện (Theme)</label>
              <div className="theme-toggle-group">
                <label className={`theme-option ${formData.theme === 'light' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={formData.theme === 'light'}
                    onChange={handleChange}
                  />
                  <span className="theme-preview light-box">️ Sáng (Light)</span>
                </label>
                <label className={`theme-option ${formData.theme === 'dark' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={formData.theme === 'dark'}
                    onChange={handleChange}
                  />
                  <span className="theme-preview dark-box"> Tối (Dark)</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Màu sắc chủ đạo (Primary Color)</label>
              <div className="color-presets">
                {colorPresets.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => handleColorSelect(c.value)}
                    className={`color-btn ${formData.primaryColor === c.value ? 'active' : ''}`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  >
                    {formData.primaryColor === c.value && ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* Cài đặt mật khẩu vùng riêng tư */}
          <div className="settings-section">
            <h3 className="section-title"> Bảo mật Vùng riêng tư</h3>
            <div className="form-group">
              <label className="form-label">Mật khẩu truy cập Vùng kín</label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới..."
                className="input-control"
                required
              />
              <span className="form-hint">
                Mật khẩu dùng để mở khóa tab "Vùng riêng tư". Được lưu trong file <code>data/profile.json</code>.
              </span>
            </div>
          </div>

          <div className="settings-footer">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: formData.primaryColor }}
              disabled={saving}
            >
              {saving ? 'Đang lưu xuống file...' : ' Lưu tất cả thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
