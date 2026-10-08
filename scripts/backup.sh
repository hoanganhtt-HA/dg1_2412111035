if [ $# -eq 0 ] || [ ! -d "$1" ]; then
    echo "Lỗi: Vui lòng cung cấp thư mục hợp lệ cần sao lưu!"
    exit 1
fi

SOURCE_DIR="$1"
DIR_NAME=$(basename "$SOURCE_DIR")
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

BACKUP_DIR="$HOME/backup"
mkdir -p "$BACKUP_DIR"

TARGET_FILE="$BACKUP_DIR/${DIR_NAME}_${TIMESTAMP}.tar.gz"

# Nén thư mục
tar -czf "$TARGET_FILE" "$SOURCE_DIR" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "Lỗi: Tạo file nén thất bại!"
    exit 2
fi

# Ghi nhật ký vào logs/backup.log
mkdir -p logs
LOG_TIME=$(date +"%Y-%m-%d %H:%M:%S")
echo "[$LOG_TIME] Backup successful: $TARGET_FILE" >> logs/backup.log

echo "Sao lưu thành công: $TARGET_FILE"
