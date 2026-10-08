FROM node:18-alpine

WORKDIR /app

# Sao chép package.json và cài đặt thư viện
COPY package*.json ./
RUN npm install --only=production

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Đổi sang người dùng không phải root
USER node

EXPOSE 5000

# Sửa thành app/server.js
CMD ["node", "app/server.js"]
