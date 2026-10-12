import React, { useState, useEffect } from 'react';

export default function PrivateNotes() {
  // các state quản lý
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ id: null, title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // xử lý và gọi api
  const handleUnlock = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('http://localhost:5000/api/private/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsUnlocked(true);
        setPasswordInput('');
        fetchPrivateNotes();
        showToast(' Đã mở khóa vùng riêng tư thành công!');
      } else {
        setAuthError(data.message || 'Mật khẩu không chính xác!');
        setPasswordInput('');
      }
    } catch (err) {
      setAuthError('Không thể kết nối tới máy chủ xác thực.');
    }
  };

  const fetchPrivateNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/private/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải ghi chú bí mật:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề ghi chú bí mật!');
      return;
    }

    const isEdit = !!formData.id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit
      ? `http://localhost:5000/api/private/notes/${formData.id}`
      : 'http://localhost:5000/api/private/notes';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content
        })
      });

      if (res.ok) {
        showToast(isEdit ? 'Đã sửa ghi chú bí mật!' : 'Đã thêm ghi chú bí mật!');
        fetchPrivateNotes();
        setFormData({ id: null, title: '', content: '' });
      }
    } catch (err) {
      alert('Lỗi khi lưu dữ liệu bí mật.');
    }
  };

  const handleEdit = (note) => {
    setFormData({ id: note.id, title: note.title, content: note.content });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa vĩnh viễn ghi chú riêng tư này?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/private/notes/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          showToast('Đã xóa ghi chú bí mật!');
          fetchPrivateNotes();
        }
      } catch (err) {
        alert('Lỗi khi xóa ghi chú bí mật.');
      }
    }
  };

  const handleLockNow = () => {
    setIsUnlocked(false);
    setNotes([]);
    setFormData({ id: null, title: '', content: '' });
    showToast(' Đã khóa an toàn vùng riêng tư!');
  };

  // giao diện
  // Màn hình Khóa bảo mật (Khi chưa mở khóa)
  if (!isUnlocked) {
    return (
      <div className="page-container lock-screen-wrapper">
        {toastMessage && <div className="toast-notification">{toastMessage}</div>}
        <div className="lock-card">
          <div className="lock-icon-badge"></div>
          <h2>Khu vực Bảo mật Private</h2>
          <p className="lock-subtitle">
            Dữ liệu ghi chú riêng tư này được bảo vệ bằng mật khẩu riêng biệt. Vui lòng nhập mật khẩu để mở khóa.
          </p>

          <form onSubmit={handleUnlock} className="lock-form">
            <div className="form-group">
              <input
                type="password"
                placeholder="Nhập mật khẩu riêng tư..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="input-control password-input"
                autoFocus
                required
              />
            </div>
            {authError && <div className="auth-error-msg">️ {authError}</div>}
            <button type="submit" className="btn btn-unlock">
              Mở khóa truy cập 
            </button>
          </form>

          <div className="lock-hint">
            <span>Gợi ý: Mật khẩu mặc định khởi tạo ban đầu là <code>123</code> (có thể đổi tại tab Cài đặt).</span>
          </div>
        </div>
      </div>
    );
  }

  // Màn hình làm việc Ghi chú Riêng tư (Sau khi mở khóa thành công)
  return (
    <div className="page-container private-mode">
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      <div className="page-header private-header">
        <div>
          <div className="badge-private">️ KHU VỰC RIÊNG TƯ</div>
          <h1 className="page-title">Ghi chú & Thông tin Riêng tư</h1>
          <p className="page-desc">Lưu trữ mật khẩu, nhật ký cá nhân, tài khoản bí mật (data/private.json).</p>
        </div>
        <button onClick={handleLockNow} className="btn btn-danger-outline">
          Khóa khu vực 
        </button>
      </div>

      {/* Form Nhập Ghi chú Bí mật */}
      <div className="card form-card private-border">
        <div className="form-card-header">
          <h3>{formData.id ? '️ Chỉnh sửa ghi chú' : ' Thêm ghi chú'}</h3>
        </div>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Tiêu đề bí mật <span className="required">*</span></label>
            <input
              type="text"
              placeholder="VD: Mật khẩu WiFi nhà, Mã pin thẻ ATM..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nội dung riêng tư</label>
            <textarea
              placeholder="Nhập thông tin quan trọng cần bảo mật..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input-control textarea-control"
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-danger">
              {formData.id ? 'Lưu cập nhật' : 'Lưu ghi chú'}
            </button>
            {formData.id && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFormData({ id: null, title: '', content: '' })}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Danh sách Ghi chú Bí mật */}
      <div className="notes-list-section">
        <div className="section-title-bar">
          <h3>Danh sách ghi chú được bảo vệ ({notes.length})</h3>
          <span className="file-badge private-file"> File: data/private.json</span>
        </div>

        {loading ? (
          <div className="loading-state">Đang đọc dữ liệu bảo mật...</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">️</div>
            <p>Chưa có ghi chú riêng tư nào trong danh sách ghi chú.</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.id} className="note-card note-card-private">
                <div className="note-card-body">
                  <div className="private-tag">Bí mật</div>
                  <h4 className="note-title">{note.title}</h4>
                  <p className="note-content">{note.content || '(Không có nội dung)'}</p>
                </div>
                <div className="note-card-footer">
                  <span className="note-date">
                     {new Date(note.updatedAt || note.createdAt).toLocaleString('vi-VN')}
                  </span>
                  <div className="note-actions">
                    <button
                      onClick={() => handleEdit(note)}
                      className="btn-icon edit"
                      title="Sửa"
                    >
                      ️
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="btn-icon delete"
                      title="Xóa"
                    >
                      ️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
