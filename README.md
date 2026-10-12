# ĐỒ ÁN MÔN HỌC: ỨNG DỤNG QUẢN LÝ GHI CHÚ (REACTJS & NODEJS)[cite: 1]
**Giảng viên hướng dẫn:** [Nguyễn Hoàng Việt][cite: 1]
**Nhóm thực hiện:** Nhóm [Số nhóm][cite: 1]
**Thành viên:**[cite: 1]
1. Trần Quốc Khánh - 0306241206 - Vai trò: PM & QA[cite: 1]
2. Trần Thanh An - 0306241171 - Vai trò: Backend Developer[cite: 1]
3. Huỳnh Kim Anh - 0306241172 - Vai trò: Frontend Developer[cite: 1]
4. Nguyễn Văn Đoàn - 0306241191 - Vai trò: Frontend Developer[cite: 1]


## 1. Công nghệ sử dụng[cite: 1]
- **Frontend:** ReactJS (Vite), React Router DOM.[cite: 1]
- **Backend:** Node.js, Express.js.[cite: 1]
- **Cơ sở dữ liệu:** File System (lưu trữ bằng định dạng `.json` để dễ quản lý và triển khai).[cite: 1]

## 2. Yêu cầu môi trường[cite: 1]
- Máy tính cần cài đặt sẵn **Node.js** (phiên bản v16 trở lên).[cite: 2]

## 3. Hướng dẫn Cài đặt & Chạy dự án (Rất quan trọng)[cite: 2]
Dự án được chia làm 2 phần chạy độc lập. Vui lòng mở 2 cửa sổ Terminal (Command Prompt) để chạy song song.[cite: 2]

### Bước 1: Khởi động Backend (Máy chủ API)[cite: 2]
Mở Terminal 1, di chuyển vào thư mục `backend` và chạy lệnh:[cite: 2]
```bash
cd backend
npm install
node server.js
```[cite: 2]
Lưu ý: Backend sẽ chạy tại http://localhost:5000. Hệ thống sẽ tự động sinh thư mục data/ chứa các file JSON. Vui lòng không xóa thư mục này khi đang chạy ứng dụng.[cite: 2]

**Bước 2: Khởi động Frontend (Giao diện)**[cite: 2]
Mở Terminal 2, di chuyển vào thư mục frontend và chạy lệnh:[cite: 2]
cd frontend
npm install
npm run dev
Lưu ý: Frontend sẽ chạy tại http://localhost:5173 (hoặc cổng khác hiển thị trên terminal). Mở đường dẫn này trên trình duyệt (Khuyến nghị Google Chrome) để sử dụng hệ thống.[cite: 2]

4. Tài khoản / Mật khẩu Demo[cite: 2]
Web không yêu cầu đăng nhập tài khoản.[cite: 2]
Để xem khu vực Ghi chú riêng tư, vui lòng vào menu "Cài đặt" để tạo mật khẩu mới.[cite: 2]
---[cite: 2]