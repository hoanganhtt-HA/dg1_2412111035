#!/bin/bash

# 1. Kiểm tra tham số đầu vào (Nếu không truyền tham số -> báo lỗi và thoát với mã 1)
if [ -z "$1" ]; then
    echo "Lỗi: Vui lòng truyền đường dẫn thư mục cần sao lưu!"
    echo "Cú pháp: $0 <thư_mục_cần_sao_lưu>"
    exit 1
fi

# Kiểm tra thư mục truyền vào có tồn tại hay không
if [ ! -d "$1" ]; then
    echo "Lỗi: Thư mục '$1' không tồn tại!"
    exit 2
fi

# 2. Định nghĩa biến đường dẫn và thời gian
BASE_DIR="$HOME/Baitap/dg1_2412111035"
BACKUP_DIR="$HOME/backup"
LOG_FILE="$BASE_DIR/logs/backup.log"

# Lấy tên thư mục gốc (loại bỏ dấu / dư thừa ở cuối nếu có)
TARGET_DIR=$(basename "$1")
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEST_FILE="$BACKUP_DIR/${TARGET_DIR}_${TIMESTAMP}.tar.gz"

# Tạo thư mục ~/backup nếu chưa có
mkdir -p "$BACKUP_DIR"

# 3. Tiến hành nén thư mục thành file .tar.gz
tar -czf "$DEST_FILE" -C "$(dirname "$1")" "$TARGET_DIR"

# Kiểm tra lệnh nén thành công hay không
if [ $? -eq 0 ]; then
    # 4. Ghi một dòng nhật ký (thời gian, tệp đích) vào logs/backup.log
    NOW=$(date +"%Y-%m-%d %H:%M:%S")
    echo "[$NOW] Backup successfully: $DEST_FILE" >> "$LOG_FILE"
    
    echo "Sao lưu thành công! File lưu tại: $DEST_FILE"
    exit 0
else
    echo "Lỗi: Quá trình nén thất bại!"
    exit 3
fi
