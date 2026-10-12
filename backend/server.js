const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình Middleware
app.use(cors());
app.use(express.json());

// Phục vụ giao diện web tĩnh dự phòng tại thư mục public 
app.use(express.static(path.join(__dirname, 'public')));

// Đường dẫn các thư mục và file dữ liệu
const dataDir = path.join(__dirname, 'data');
const notesDir = path.join(dataDir, 'notes');
const profilePath = path.join(dataDir, 'profile.json');
const privateNotesPath = path.join(dataDir, 'private.json');

// Khởi tạo dữ liệu
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir, { recursive: true });
}

// Khởi tạo file profile.json nếu chưa có
if (!fs.existsSync(profilePath)) {
  const defaultProfile = {
    displayName: "Sinh viên nhóm 1",
    theme: "light",
    primaryColor: "#2563eb",
    password: "123" // mật khẩu cho private
  };
  fs.writeFileSync(profilePath, JSON.stringify(defaultProfile, null, 2), 'utf8');
}

// Khởi tạo file private.json nếu chưa có
if (!fs.existsSync(privateNotesPath)) {
  const defaultPrivate = [
    {
      id: "priv-001",
      title: "Thông tin thẻ ngân hàng & tài khoản",
      content: "Số tài khoản: 1903xxxxxx - Ngân hàng Techcombank (Chi nhánh TP.HCM)",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(privateNotesPath, JSON.stringify(defaultPrivate, null, 2), 'utf8');
}

// Khởi tạo dữ liệu mẫu cho các chủ đề công khai
const initSampleTopic = (topic, sampleNotes) => {
  const filePath = path.join(notesDir, `${topic}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(sampleNotes, null, 2), 'utf8');
  }
};

initSampleTopic('hoc-tap', [
  {
    id: "note-ht-1",
    title: "Kế hoạch bảo vệ đồ án Web",
    content: "Chuẩn bị Slide thuyết trình, phân công kịch bản 4 người, kiểm tra server và client trước 30 phút.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "note-ht-2",
    title: "Ôn tập kiến trúc React SPA",
    content: "Nắm vững luồng State, Props, useEffect, Context API và cách kết nối RESTful API với Express.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]);

initSampleTopic('cong-viec', [
  {
    id: "note-cv-1",
    title: "Rà soát mã nguồn Sprint 4",
    content: "Xóa console.log thừa, kiểm tra lại file README.md và xuất file zip nộp bài.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]);

initSampleTopic('ca-nhan', [
  {
    id: "note-cn-1",
    title: "Mục tiêu tuần này",
    content: "Tập thuyết trình cùng nhóm qua Google Meet ít nhất 2 lần để khớp thời gian 12-15 phút.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]);

// Helper: Lấy đường dẫn file theo chủ đề
const getTopicFilePath = (topic) => path.join(notesDir, `${topic}.json`);

// QUản lý profile và cài đặt hệ htoongs

// 1.1 Lấy thông tin Profile
app.get('/api/profile', (req, res) => {
  try {
    const rawData = fs.readFileSync(profilePath, 'utf8');
    const profile = JSON.parse(rawData);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Lỗi đọc file cấu hình profile" });
  }
});

// 1.2 Cập nhật thông tin Profile & Giao diện
app.put('/api/profile', (req, res) => {
  try {
    const newProfile = req.body;
    fs.writeFileSync(profilePath, JSON.stringify(newProfile, null, 2), 'utf8');
    res.json({ success: true, message: "Đã cập nhật Profile thành công", profile: newProfile });
  } catch (error) {
    res.status(500).json({ message: "Lỗi ghi dữ liệu profile xuống server" });
  }
});

// Quản lý ghi chú công khai

// 2.1 Lấy danh sách ghi chú theo chủ đề
app.get('/api/notes/:topic', (req, res) => {
  const filePath = getTopicFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.json([]);
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: "Lỗi đọc danh sách ghi chú" });
  }
});

// 2.2 Thêm mới ghi chú vào chủ đề
app.post('/api/notes/:topic', (req, res) => {
  const filePath = getTopicFilePath(req.params.topic);
  try {
    let notes = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    const newNote = {
      id: Date.now().toString(),
      title: req.body.title ? req.body.title.trim() : "Không tiêu đề",
      content: req.body.content ? req.body.content.trim() : "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.unshift(newNote);
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
    res.json({ success: true, message: "Thêm ghi chú thành công", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm ghi chú mới" });
  }
});

// 2.3 Cập nhật ghi chú
app.put('/api/notes/:topic/:id', (req, res) => {
  const filePath = getTopicFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Không tìm thấy chủ đề" });
    let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const index = notes.findIndex(n => n.id === req.params.id);
    if (index !== -1) {
      notes[index].title = req.body.title !== undefined ? req.body.title.trim() : notes[index].title;
      notes[index].content = req.body.content !== undefined ? req.body.content.trim() : notes[index].content;
      notes[index].updatedAt = new Date().toISOString();
      fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
      return res.json({ success: true, message: "Đã sửa ghi chú thành công", note: notes[index] });
    }
    res.status(404).json({ message: "Không tìm thấy ghi chú cần sửa" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật ghi chú" });
  }
});

// 2.4 Xóa ghi chú
app.delete('/api/notes/:topic/:id', (req, res) => {
  const filePath = getTopicFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Không tìm thấy chủ đề" });
    let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const filteredNotes = notes.filter(n => n.id !== req.params.id);
    fs.writeFileSync(filePath, JSON.stringify(filteredNotes, null, 2), 'utf8');
    res.json({ success: true, message: "Đã xóa ghi chú thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa ghi chú" });
  }
});

// Bảo mật và ghi chú riêng tư

// 3.1 Xác thực mật khẩu vùng riêng tư
app.post('/api/private/auth', (req, res) => {
  try {
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    const userPass = req.body.password;
    if (profile.password === userPass) {
      res.json({ success: true, message: "Mở khóa thành công!" });
    } else {
      res.status(401).json({ success: false, message: "Sai mật khẩu! Vui lòng thử lại." });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống xác thực" });
  }
});

// 3.2 Lấy danh sách ghi chú riêng tư
app.get('/api/private/notes', (req, res) => {
  try {
    if (!fs.existsSync(privateNotesPath)) return res.json([]);
    const data = fs.readFileSync(privateNotesPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: "Lỗi đọc ghi chú riêng tư" });
  }
});

// 3.3 Thêm mới ghi chú riêng tư
app.post('/api/private/notes', (req, res) => {
  try {
    let notes = fs.existsSync(privateNotesPath) ? JSON.parse(fs.readFileSync(privateNotesPath, 'utf8')) : [];
    const newNote = {
      id: "priv-" + Date.now().toString(),
      title: req.body.title ? req.body.title.trim() : "Ghi chú bảo mật",
      content: req.body.content ? req.body.content.trim() : "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.unshift(newNote);
    fs.writeFileSync(privateNotesPath, JSON.stringify(notes, null, 2), 'utf8');
    res.json({ success: true, message: "Đã lưu ghi chú bí mật", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm ghi chú riêng tư" });
  }
});

// 3.4 Sửa ghi chú riêng tư
app.put('/api/private/notes/:id', (req, res) => {
  try {
    let notes = JSON.parse(fs.readFileSync(privateNotesPath, 'utf8'));
    const index = notes.findIndex(n => n.id === req.params.id);
    if (index !== -1) {
      notes[index].title = req.body.title !== undefined ? req.body.title.trim() : notes[index].title;
      notes[index].content = req.body.content !== undefined ? req.body.content.trim() : notes[index].content;
      notes[index].updatedAt = new Date().toISOString();
      fs.writeFileSync(privateNotesPath, JSON.stringify(notes, null, 2), 'utf8');
      return res.json({ success: true, message: "Đã cập nhật ghi chú bí mật" });
    }
    res.status(404).json({ message: "Không tìm thấy ghi chú bí mật" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật ghi chú bí mật" });
  }
});

// 3.5 Xóa ghi chú riêng tư
app.delete('/api/private/notes/:id', (req, res) => {
  try {
    let notes = JSON.parse(fs.readFileSync(privateNotesPath, 'utf8'));
    const filteredNotes = notes.filter(n => n.id !== req.params.id);
    fs.writeFileSync(privateNotesPath, JSON.stringify(filteredNotes, null, 2), 'utf8');
    res.json({ success: true, message: "Đã xóa ghi chú bí mật" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa ghi chú bí mật" });
  }
});

app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NoteKeeper API</title>
    </head>
    <body>
      <h2>NoteKeeper API</h2>
      <p>Danh sách đường dẫn API của hệ thống.</p>

      <h3>Cấu hình</h3>
      <ul>
        <li>
          <a href="${baseUrl}/api/profile">
            ${baseUrl}/api/profile
          </a>
          - Cấu hình người dùng
        </li>
      </ul>

      <h3>Ghi chú</h3>
      <ul>
        <li>
          <a href="${baseUrl}/api/notes/hoc-tap">
            ${baseUrl}/api/notes/hoc-tap
          </a>
          - Ghi chú học tập
        </li>
        <li>
          <a href="${baseUrl}/api/notes/cong-viec">
            ${baseUrl}/api/notes/cong-viec
          </a>
          - Ghi chú công việc
        </li>
        <li>
          <a href="${baseUrl}/api/notes/ca-nhan">
            ${baseUrl}/api/notes/ca-nhan
          </a>
          - Ghi chú cá nhân
        </li>
      </ul>

      <h3>Ghi chú riêng tư</h3>
      <ul>
        <li>
          <a href="${baseUrl}/api/private/notes">
            ${baseUrl}/api/private/notes
          </a>
          - Danh sách ghi chú riêng tư
        </li>
        <li>
          <a href="${baseUrl}/api/private/auth">
            ${baseUrl}/api/private/auth
          </a>
          - Đường dẫn xác thực mật khẩu
        </li>
      </ul>
    </body>
    </html>
  `);
});



app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` [BACKEND] Máy chủ đang chạy tại: http://localhost:${PORT}`);
  console.log(` Dữ liệu JSON được lưu tại thư mục: ${dataDir}`);
  console.log(`=======================================================`);
});
