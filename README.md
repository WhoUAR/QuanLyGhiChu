# ĐỒ ÁN MÔN HỌC: HỆ THỐNG QUẢN LÝ GHI CHÚ VÀ THÔNG TIN RIÊNG TƯ (REACTJS & NODEJS)

**Giảng viên hướng dẫn:** [Tên giảng viên bộ môn]  
**Nhóm thực hiện:** Nhóm 1  
**Danh sách thành viên & Phân công nhiệm vụ:**
1. **Thành viên 1:** [Họ và tên 1] - [Mã SV 1] - **Vai trò: Project Manager (PM) & QA/QC** (Quản lý tiến độ Trello, Thiết kế Wireframe, Viết Testcase, Nghiệm thu chất lượng sản phẩm).
2. **Thành viên 2:** [Họ và tên 2] - [Mã SV 2] - **Vai trò: Frontend Developer 1 (UI/Layout Lead)** (Dựng khung ứng dụng Vite + React, Cấu hình Router, Quản lý State toàn cục Context API, Màn hình Cài đặt & Theme Sáng/Tối).
3. **Thành viên 3:** [Họ và tên 3] - [Mã SV 3] - **Vai trò: Frontend Developer 2 (Feature & Security Lead)** (Xây dựng giao diện Ghi chú công khai theo chủ đề, Xây dựng lớp bảo vệ Guard và giao diện Vùng kín Private Notes, Ghép nối API).
4. **Thành viên 4:** [Họ và tên 4] - [Mã SV 4] - **Vai trò: Backend Developer (API & Storage Lead)** (Xây dựng RESTful API Node.js/Express, Quản lý đọc/ghi File System JSON, Xác thực mật khẩu, Kiểm soát phiên bản Git & Xử lý Conflict).

---

## 1. Công nghệ sử dụng
- **Frontend:** ReactJS 18, React Router DOM v6, Context API (quản lý Theme, Profile).
- **Backend:** Node.js, Express.js, CORS.
- **Cơ sở dữ liệu:** File System (Lưu trữ bằng định dạng `.json` tại thư mục `backend/data/` giúp dễ dàng triển khai, không cần cài đặt CSDL cồng kềnh).

---

## 2. Yêu cầu môi trường
- Máy tính đã cài đặt sẵn **Node.js** (phiên bản v16.0.0 trở lên).
- Trình duyệt web hiện đại (Google Chrome, Microsoft Edge, Firefox).

---

## 3. Hướng dẫn Cài đặt & Chạy ứng dụng

Dự án được chia làm 2 phần chạy độc lập. Vui lòng mở **2 cửa sổ Terminal (hoặc Command Prompt)** để chạy song song:

### 🔹 Bước 1: Khởi động Backend (Máy chủ API)
Mở **Terminal 1**, di chuyển vào thư mục `backend` và chạy các lệnh:
```bash
cd backend
npm install
node server.js
```
*Lưu ý:* Backend sẽ chạy tại cổng `http://localhost:5000`. Hệ thống sẽ tự động sinh thư mục `backend/data/` và các file JSON mẫu nếu chưa có. Vui lòng **không xóa** thư mục `backend/data/` trong quá trình ứng dụng đang chạy.

### 🔹 Bước 2: Khởi động Frontend (Giao diện người dùng)
Mở **Terminal 2**, di chuyển vào thư mục `frontend` và chạy các lệnh:
```bash
cd frontend
npm install
npm run dev
```
*Lưu ý:* Frontend sẽ chạy tại `http://localhost:5173` (hoặc cổng hiển thị trên Terminal). Mở đường dẫn này trên trình duyệt (khuyến nghị Google Chrome) để bắt đầu trải nghiệm.

---

## 4. Tài khoản & Mật khẩu Demo
- Ứng dụng là dạng SPA cá nhân, không yêu cầu đăng nhập tài khoản người dùng bên ngoài.
- **Mật khẩu truy cập Vùng riêng tư (Private Notes):**
  - Mật khẩu mặc định: `123`
  - Người dùng có thể đổi mật khẩu này bất kỳ lúc nào tại menu **"Cài đặt hệ thống"** (`/settings`).

---

## 5. Cấu trúc lưu trữ dữ liệu (JSON Files)
```text
backend/
├── data/
│   ├── profile.json       # Lưu: Tên hiển thị, Theme (light/dark), Màu sắc, Mật khẩu vùng riêng tư
│   ├── private.json       # Lưu: Danh sách ghi chú nhạy cảm/bí mật
│   └── notes/             # Thư mục lưu ghi chú công khai theo từng chủ đề
│       ├── hoc-tap.json   # Ghi chú chủ đề Học tập
│       ├── cong-viec.json # Ghi chú chủ đề Công việc
│       └── ca-nhan.json   # Ghi chú chủ đề Cá nhân
├── server.js              # Mã nguồn toàn bộ REST API
└── package.json
```

---

## 6. Kết quả Kiểm thử Chất lượng (QC Summary)
- **Tổng số Testcase:** 25 testcase (Bao gồm Happy Path và Edge Case).
- **Tỉ lệ Đạt (Pass):** 22/25 (88% trong lần chạy đầu).
- **Số lỗi phát hiện & đã khắc phục (Fixed):** 5/5 lỗi (100% hoàn thành).
