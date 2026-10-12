import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Notes from './components/Notes';
import PrivateNotes from './components/PrivateNotes';
import Settings from './components/Settings';

function Home() {
  const { profile } = useContext(AppContext);

  return (
    <div className="page-container">
      <header className="home-heading">
        <p className="eyebrow">NOTEKEEPER</p>
        <h1>Xin chào, {profile.displayName || 'Sinh viên'}</h1>
        <p>Quản lý ghi chú học tập, công việc và thông tin cá nhân tại một nơi.</p>
      </header>

      <section className="dashboard-grid">
        <Link to="/notes" className="dash-card">
          <div className="dash-info">
            <h3>Ghi chú chung</h3>
            <p>Tạo, chỉnh sửa, tìm kiếm và phân loại ghi chú theo chủ đề.</p>
            <span className="dash-link">Mở ghi chú</span>
          </div>
        </Link>

        <Link to="/private" className="dash-card">
          <div className="dash-info">
            <h3>Ghi chú riêng tư</h3>
            <p>Lưu các nội dung cá nhân trong khu vực yêu cầu mật khẩu.</p>
            <span className="dash-link">Mở khu vực riêng tư</span>
          </div>
        </Link>

        <Link to="/settings" className="dash-card">
          <div className="dash-info">
            <h3>Cài đặt</h3>
            <p>Thay đổi tên hiển thị, giao diện và mật khẩu riêng tư.</p>
            <span className="dash-link">Mở cài đặt</span>
          </div>
        </Link>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/private" element={<PrivateNotes />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}
