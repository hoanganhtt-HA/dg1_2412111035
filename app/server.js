const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware đọc dữ liệu JSON gửi lên qua POST/PUT
app.use(express.json());

// Serve file tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// Hàm hỗ trợ đọc file JSON
const getStudentsData = () => {
    const jsonPath = path.join(__dirname, 'data', 'students.json');
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(rawData);
};

// Hàm hỗ trợ ghi dữ liệu vào file JSON
const saveStudentsData = (data) => {
    const jsonPath = path.join(__dirname, 'data', 'students.json');
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
};

// 1. GET /api/health
app.get('/api/health', (req, res) => {
    res.json({
        status: "ok",
        student: "2412111035"
    });
});

// 2. GET /api/students
app.get('/api/students', (req, res) => {
    try {
        let students = getStudentsData();
        const { lop } = req.query;
        if (lop) {
            students = students.filter(s => s.lop.toLowerCase() === lop.toLowerCase());
        }
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Không thể đọc dữ liệu sinh viên' });
    }
});

// 3. GET /api/students/:id
app.get('/api/students/:id', (req, res) => {
    try {
        const students = getStudentsData();
        const studentId = parseInt(req.params.id, 10);
        const student = students.find(s => s.id === studentId);

        if (!student) {
            return res.status(404).json({ message: 'Sinh viên không tồn tại' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Không thể đọc dữ liệu sinh viên' });
    }
});

// 4. POST /api/students - Thêm sinh viên mới
app.post('/api/students', (req, res) => {
    try {
        const { mssv, ho_ten, lop, diem } = req.body;

        // Kiểm tra thiếu trường thông tin
        if (!mssv || !ho_ten || !lop || diem === undefined || diem === null) {
            return res.status(400).json({ message: 'Thiếu trường dữ liệu bắt buộc (mssv, ho_ten, lop, diem)' });
        }

        // Kiểm tra điểm nằm ngoài khoảng 0–10
        const numericDiem = parseFloat(diem);
        if (isNaN(numericDiem) || numericDiem < 0 || numericDiem > 10) {
            return res.status(400).json({ message: 'Điểm phải nằm trong khoảng từ 0 đến 10' });
        }

        const students = getStudentsData();

        // Tự sinh ID tự tăng (lấy ID lớn nhất + 1, nếu rỗng thì bắt đầu từ 1)
        const maxId = students.length > 0 ? Math.max(...students.map(s => s.id)) : 0;
        const newStudent = {
            id: maxId + 1,
            mssv,
            ho_ten,
            lop,
            diem: numericDiem
        };

        students.push(newStudent);
        saveStudentsData(students);

        // Trả về kết quả với status 201 Created
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: 'Không thể ghi dữ liệu sinh viên' });
    }
});

// GET /
app.get('/', (req, res) => {
    try {
        const students = getStudentsData();
        const tableRows = students.map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.mssv}</td>
                <td>${s.ho_ten}</td>
                <td>${s.lop}</td>
                <td>${s.diem}</td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>DG1 – Dao Vu Hoang Anh – 2412111035</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1>Danh Sách Sinh Viên</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>MSSV</th>
                            <th>Họ và Tên</th>
                            <th>Lớp</th>
                            <th>Điểm</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        res.send(html);
    } catch (error) {
        res.status(500).send('Lỗi máy chủ!');
    }
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
