import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Notes() {
// các state
  const { profile } = useContext(AppContext);
  const [topic, setTopic] = useState('hoc-tap');
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ id: null, title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // các logic gọi api
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${topic}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Lỗi khi fetch danh sách ghi chú:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [topic]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề ghi chú!');
      return;
    }

    const isEdit = !!formData.id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit
      ? `http://localhost:5000/api/notes/${topic}/${formData.id}`
      : `http://localhost:5000/api/notes/${topic}`;

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
        showToast(isEdit ? 'Đã cập nhật ghi chú thành công!' : 'Đã thêm ghi chú mới thành công!');
        fetchNotes();
        setFormData({ id: null, title: '', content: '' });
      } else {
        alert('Có lỗi xảy ra từ máy chủ khi lưu.');
      }
    } catch (error) {
      alert('Không thể kết nối đến máy chủ Backend.');
    }
  };

  const handleEdit = (note) => {
    setFormData({ id: note.id, title: note.title, content: note.content });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ghi chú này không?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/notes/${topic}/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          showToast('Đã xóa ghi chú thành công!');
          fetchNotes();
        }
      } catch (error) {
        alert('Lỗi kết nối khi xóa ghi chú.');
      }
    }
  };

  // Lọc ghi chú theo từ khóa tìm kiếm
  const filteredNotes = notes.filter((n) => {
    const q = searchTerm.toLowerCase();
    return n.title.toLowerCase().includes(q) || (n.content && n.content.toLowerCase().includes(q));
  });

  // render các giao diện
  return (
    <div className="page-container">
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Ghi chú chung</h1>
          <p className="page-desc">Phân loại theo chủ đề và lưu trữ dưới dạng file JSON độc lập.</p>
        </div>
      </div>

      {/* vùng Chọn Chủ đề tìm kiếm */}
      <div className="toolbar-section">
        <div className="topic-tabs">
          {[
            { id: 'hoc-tap', label: ' Học tập' },
            { id: 'cong-viec', label: ' Công việc' },
            { id: 'ca-nhan', label: ' Cá nhân' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setTopic(tab.id);
                setFormData({ id: null, title: '', content: '' });
              }}
              className={`topic-tab-btn ${topic === tab.id ? 'active' : ''}`}
              style={topic === tab.id ? { borderColor: profile.primaryColor, color: profile.primaryColor } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder=" Tìm kiếm tiêu đề hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-control"
          />
        </div>
      </div>

      {/* Form Thêm / Sửa Ghi chú */}
      <div className="card form-card">
        <div className="form-card-header">
          <h3>{formData.id ? '️ Chỉnh sửa ghi chú' : ' Thêm ghi chú mới'}</h3>
          {formData.id && (
            <span className="editing-badge">Đang sửa: ID {formData.id}</span>
          )}
        </div>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Tiêu đề ghi chú <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Nhập tiêu đề ghi chú..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nội dung ghi chú</label>
            <textarea
              placeholder="Nhập chi tiết nội dung ghi chú ở đây..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input-control textarea-control"
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: profile.primaryColor }}
            >
              {formData.id ? 'Lưu thay đổi' : 'Tạo ghi chú mới'}
            </button>
            {formData.id && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFormData({ id: null, title: '', content: '' })}
              >
                Hủy bỏ
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Danh sách Ghi chú dạng Grid Cards */}
      <div className="notes-list-section">
        <div className="section-title-bar">
          <h3>
            Danh sách ({filteredNotes.length}{' '}
            {notes.length !== filteredNotes.length ? `/ ${notes.length}` : ''})
          </h3>
          <span className="file-badge"> File: data/notes/{topic}.json</span>
        </div>

        {loading ? (
          <div className="loading-state">Đang tải dữ liệu ghi chú...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <p>Chưa có ghi chú nào phù hợp trong chủ đề này.</p>
            <span className="sub">Hãy nhập thông tin vào form bên trên để tạo mới.</span>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-card-body">
                  <h4 className="note-title">{note.title}</h4>
                  <p className="note-content">{note.content || '(Không có nội dung)'}</p>
                </div>
                <div className="note-card-footer">
                  <span className="note-date">
                     {new Date(note.updatedAt || note.createdAt).toLocaleString('vi-VN')}
                  </span>
                  <div className="note-actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(note)}
                      className="edit-button"
                      title="Sửa ghi chú"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      className="delete-button"
                      title="Xóa ghi chú"
                    >
                      Xóa
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
