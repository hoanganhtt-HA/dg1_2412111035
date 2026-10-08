const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Serve file tĩnh từ thư mục 'public' (để trình duyệt nạp style.css)
app.use(express.static(path.join(__dirname, 'public')));

// Route GET /
app.get('/', (req, res) => {
    const jsonPath = path.join(__dirname, 'app', 'data', 'students.json');

    // Đọc file JSON danh sách sinh viên
    fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Lỗi máy chủ: Không thể đọc tệp dữ liệu!');
        }

        let students = [];
        try {
            students = JSON.parse(data);
        } catch (e) {
            return res.status(500).send('Lỗi máy chủ: Cú pháp JSON không hợp lệ!');
        }

        // Tạo các hàng trong bảng từ danh sách sinh viên
        const tableRows = students.map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.mssv}</td>
                <td>${s.ho_ten}</td>
                <td>${s.lop}</td>
                <td>${s.diem}</td>
            </tr>
        `).join('');

        // Trả về HTML đầy đủ với CSS tĩnh
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
    });
});

// Chạy server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
