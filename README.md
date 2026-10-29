# 236455_HuynhLeBaoNgoc

## 1. Giới thiệu đề tài

**Đề tài:** Xây dựng ứng dụng quản lý món ăn (Food Management).

Ứng dụng cho phép người dùng xem danh sách món ăn, xem chi tiết, thêm mới, cập nhật, xóa và tìm kiếm món ăn. Dữ liệu được lưu trữ trên MongoDB Atlas và được truy cập thông qua backend API.

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

Tạo file `backend/.env` với nội dung mẫu:

```env
PORT=5000
MONGODB_URI=<YOUR_MONGODB_ATLAS_CONNECTION_STRING>
```

Thay giá trị mẫu bằng chuỗi kết nối MongoDB Atlas của cá nhân.

**Lưu ý bảo mật:** Không commit file `.env`, mật khẩu, access token hoặc chuỗi kết nối có thông tin xác thực lên GitHub. Chỉ sử dụng giá trị giả trong các ví dụ tài liệu.

## 5. Chạy ứng dụng trong môi trường phát triển

### 5.1. Chạy backend

```bash
cd backend
npm ci
npm start
```

Backend mặc định sử dụng cổng `5000`. Đảm bảo đã cấu hình file `.env` hợp lệ trước khi chạy.

### 5.2. Chạy frontend

Mở terminal khác tại thư mục gốc dự án:

```bash
cd frontend
npm ci
npm run dev
```

Vite chạy ở chế độ phát triển. Cấu hình proxy trong `vite.config.js` hiện chuyển các request `/api` và `/health` đến backend tại `http://localhost:5000`.

## 6. Đóng gói và chạy bằng Docker

### 6.1. Backend

Build image:

```bash
docker build -t s236455/236455huynhlebaongoc-backend:1.0 ./backend
```

Chạy container:

```bash
docker run -d \
  --name food-backend \
  --env-file backend/.env \
  -p 5000:5000 \
  s236455/236455huynhlebaongoc-backend:1.0
```

Kiểm tra trạng thái backend:

```bash
curl http://localhost:5000/health
```

### 6.2. Frontend

Build image:

```bash
docker build -t s236455/236455huynhlebaongoc-frontend:1.0 ./frontend
```

Frontend được phục vụ bằng Nginx trên cổng `80`.

Để Nginx chuyển tiếp API đến backend, hai container cần nằm trong cùng Docker network. Có thể tạo mạng và chạy các container như sau:

```bash
docker network create food-network
```

Chạy backend với alias `backend` trong mạng Docker:

```bash
docker run -d \
  --name food-backend \
  --network food-network \
  --network-alias backend \
  --env-file backend/.env \
  -p 5000:5000 \
  s236455/236455huynhlebaongoc-backend:1.0
```

Chạy frontend:

```bash
docker run -d \
  --name food-frontend \
  --network food-network \
  -p 8080:80 \
  s236455/236455huynhlebaongoc-frontend:1.0
```

Truy cập giao diện tại:

`http://localhost:8080`

Kiểm tra API thông qua Nginx:

```bash
curl http://localhost:8080/health
```

Nếu đã có container cùng tên hoặc cổng đang được sử dụng, cần kiểm tra trạng thái Docker và chọn tên hoặc cổng khác trước khi chạy lại.

## 7. Docker Hub

- **Backend image:** https://hub.docker.com/r/s236236/236455huynhlebaongoc-backend
- **Frontend image:** https://hub.docker.com/r/s236236/236455huynhlebaongoc-frontend

Các tag dự kiến: `1.0` và `latest`.


