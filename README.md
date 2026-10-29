# 236455_HuynhLeBaoNgoc

## 1. Giới thiệu đề tài

**Đề tài:** Xây dựng ứng dụng quản lý món ăn (Food Management).

Ứng dụng cho phép người dùng xem danh sách, xem chi tiết, thêm mới, tìm kiếm, cập nhật và xóa món ăn. Dữ liệu được lưu trữ trên MongoDB Atlas và truy cập thông qua Backend API.

## 2. Công nghệ sử dụng

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Cơ sở dữ liệu:** MongoDB Atlas
- **Đóng gói ứng dụng:** Docker, Nginx
- **Quản lý mã nguồn:** Git, GitHub
- **Triển khai:** Render
- **Lưu trữ Docker image:** Docker Hub

## 3. Cấu trúc dự án

```text
236455_HuynhLeBaoNgoc/
├── backend/
│   ├── models/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── .gitignore
└── README.md
```

## 4. Cấu hình môi trường

Backend sử dụng biến môi trường để cấu hình cổng chạy và kết nối MongoDB Atlas.

Tạo file `backend/.env`:

```env
PORT=5000
MONGODB_URI=<YOUR_MONGODB_ATLAS_CONNECTION_STRING>
```

Thay giá trị mẫu bằng chuỗi kết nối MongoDB Atlas của cá nhân.

**Lưu ý bảo mật:** Không commit file `.env`, mật khẩu, access token hoặc chuỗi kết nối có thông tin xác thực lên GitHub.

## 5. Chạy ứng dụng trong môi trường phát triển

### 5.1. Backend

```bash
cd backend
npm ci
npm start
```

Backend mặc định sử dụng cổng `5000`. Đảm bảo file `.env` đã được cấu hình hợp lệ.

### 5.2. Frontend

Mở terminal khác tại thư mục gốc dự án:

```bash
cd frontend
npm ci
npm run dev
```

Vite chạy ở chế độ phát triển. Cấu hình proxy trong `vite.config.js` chuyển request `/api` và `/health` đến backend tại `http://localhost:5000`, nếu cấu hình hiện tại của dự án vẫn sử dụng địa chỉ này.

## 6. Đóng gói và chạy bằng Docker

### 6.1. Backend

Build image:

```bash
docker build -t s236455/236455huynhlebaongoc-backend:1.1 ./backend
```

Chạy container:

```bash
docker run -d \
  --name food-backend \
  --env-file backend/.env \
  -p 5000:5000 \
  s236455/236455huynhlebaongoc-backend:1.1
```

Kiểm tra backend:

```bash
curl http://localhost:5000/health
```

### 6.2. Frontend

Build image:

```bash
docker build -t s236455/236455huynhlebaongoc-frontend:1.2 ./frontend
```

Nếu tag `1.2` chưa tồn tại trên Docker Hub, hãy thay bằng tag frontend thực tế đã push thành công.

Để Nginx chuyển tiếp API đến backend qua Docker network, hai container cần nằm trong cùng mạng và cấu hình Nginx phải sử dụng hostname backend phù hợp.

Tạo mạng Docker:

```bash
docker network create food-network
```

Chạy backend trong mạng:

```bash
docker run -d \
  --name food-backend \
  --network food-network \
  --network-alias backend \
  --env-file backend/.env \
  -p 5000:5000 \
  s236455/236455huynhlebaongoc-backend:1.1
```

Chạy frontend:

```bash
docker run -d \
  --name food-frontend \
  --network food-network \
  -p 8080:80 \
  s236455/236455huynhlebaongoc-frontend:1.2
```

Truy cập giao diện tại `http://localhost:8080`.

Kiểm tra API qua Nginx:

```bash
curl http://localhost:8080/health
```

Lưu ý: Nếu đã có container cùng tên hoặc cổng đang được sử dụng, hãy kiểm tra Docker trước khi chạy lại.

## 7. Triển khai trực tuyến trên Render

- **Frontend:** https://web-236455.onrender.com
- **Backend API:** https://api-236455.onrender.com
- **Health check:** https://api-236455.onrender.com/health
- **Danh sách món ăn:** https://api-236455.onrender.com/api/foods

Health check trả về thông tin trạng thái API và kết nối cơ sở dữ liệu.

## 8. Docker Hub

- **Backend image:** https://hub.docker.com/r/s236455/236455huynhlebaongoc-backend
- **Frontend image:** https://hub.docker.com/r/s236455/236455huynhlebaongoc-frontend

Sử dụng các tag image thực tế đã được push thành công lên Docker Hub và được cấu hình trong Render.

## 9. Kiểm thử chức năng

Các chức năng cần kiểm tra:

- Xem danh sách món ăn.
- Xem chi tiết món ăn.
- Tìm kiếm món ăn.
- Thêm món ăn mới.
- Cập nhật thông tin món ăn.
- Xóa món ăn.
- Kiểm tra dữ liệu được lưu và cập nhật trong MongoDB Atlas.
- Kiểm tra frontend, backend API và endpoint health check.

## 10. Repository GitHub

Mã nguồn dự án: https://github.com/BaoNgoc949/236455_HuynhLeBaoNgoc
