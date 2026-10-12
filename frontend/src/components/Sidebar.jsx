import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Sidebar() {
  const { profile } = useContext(AppContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">N</div>
        <div className="brand-text">
          <h2>NoteKeeper</h2>
          <span className="badge">Quản lý ghi chú</span>
        </div>
      </div>

      <div className="user-profile-widget">
        <div className="avatar">{(profile.displayName || 'N').trim().charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <div className="name">{profile.displayName || 'Chưa đặt tên'}</div>
          <div className="status">Đang sử dụng</div>
        </div>
      </div>

      <nav className="nav-menu">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Trang chủ</span>
        </NavLink>
        <NavLink to="/notes" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Ghi chú chung</span>
        </NavLink>
        <NavLink to="/private" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Ghi chú riêng tư</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span>Cài đặt</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <span>Lưu trữ dữ liệu: JSON</span>
      </div>
    </aside>
  );
}
