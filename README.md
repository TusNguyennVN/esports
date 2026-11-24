# 🎮 ESPORTS GAMING PLATFORM - DỰ ÁN WEBSITE THỂ THAO ĐIỆN TỬ ĐA BỘ MÔN

> **Phiên bản:** v3.0.0 (Đã tái cấu trúc mã nguồn & phân tầng thư mục chuẩn công nghiệp)  
> **Ngôn ngữ:** HTML5, CSS3, Vanilla JavaScript (ES6+), Python 3 Backend, SQLite Database

---

## 📌 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

Hệ thống website thể thao điện tử (Esports Platform) toàn diện, tích hợp đầy đủ các tựa game hàng đầu thế giới: **Liên Minh Huyền Thoại (LOL)**, **Valorant**, **Liên Quân Mobile**, **Free Fire** và **FC Online**.

Website cung cấp hệ sinh thái tính năng hoàn chỉnh:
* **Hệ thống xác thực & tài khoản tập trung:** Lưu trữ người dùng thực tế trên cơ sở dữ liệu SQLite (`esports.db`), hỗ trợ đăng ký, đăng nhập từ nhiều thiết bị (điện thoại, máy tính, mạng LAN, Internet).
* **Xác thực mã OTP gửi về Email thật:** Kết hợp song song giữa máy chủ Python (Gmail SMTP) và dịch vụ EmailJS client-side.
* **Cổng quản lý cá nhân (ESPORTS ID Portal):** Tùy chỉnh Riot-style ID (`Name#Tag`), đổi Avatar động, nạp tiền ví điện tử qua mã VietQR, lịch sử giao dịch.
* **Cơ sở dữ liệu Wiki Spotlight:** Tra cứu thông số tướng, bộ kỹ năng (kèm video demo CDN), bộ sưu tập trang phục (skins), trang bị và vũ khí.
* **Đội tuyển & Lịch thi đấu:** Hồ sơ tuyển thủ chuyên nghiệp (Team Flash, Saigon Phantom, T1,...), tóm tắt trận đấu và sơ đồ đội hình ra sân.
* **Cửa hàng Gaming Gear & Vé giải đấu:** Quản lý giỏ hàng, thanh toán chuyển khoản quét mã VietQR tự động.
* **Mini-game Luyện phản xạ & Đa ngôn ngữ:** Trò chơi đo tốc độ phản xạ của game thủ và hỗ trợ dịch song ngữ Anh - Việt toàn diện.
* **Bảng điều khiển Quản trị viên (Admin Panel):** Quản lý thành viên, thống kê tài chính và cấu hình hệ thống.

---

## 🏗️ 2. SƠ ĐỒ KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

```
+-------------------------------------------------------------------------------+
|                           CLIENT TIER (WEB BROWSERS)                          |
|         Desktop PC / Laptop / Mobile (iOS, Android) / Tablet Devices          |
+-------------------------------------------------------------------------------+
         |                                           ^
         | HTTP / HTTPS Requests                     | JSON Responses
         v                                           |
+-------------------------------------------------------------------------------+
|                    SERVER TIER (PYTHON 3 HTTP SERVER)                         |
|   server.py  (Port 8000, 0.0.0.0 Binding, Multi-interface, CORS Enabled)      |
+-------------------------------------------------------------------------------+
   |                      |                                |
   | Query / Insert       | Send Real Email                | Verify / Config
   v                      v                                v
+-------------------+  +----------------------------+  +------------------------+
|   DATABASE TIER   |  |     SMTP EMAIL ENGINE      |  |   CLIENT EMAIL ENGINE  |
|  SQLite 3 Engine  |  |    Gmail SMTP (Port 587)   |  |   EmailJS SDK (Backup) |
|  (server/esports) |  |   HTML Responsive Template |  |   Direct Client-to-API |
+-------------------+  +----------------------------+  +------------------------+
```

---

## 📁 3. CẤU TRÚC THƯ MỤC CHUẨN HÓA (DIRECTORY STRUCTURE)

Dự án được phân chia theo cấu trúc phân tầng rõ ràng giữa **Frontend Assets**, **Backend Services**, **Tài liệu** và **Các trang giao diện**:

```text
EsportsWebsite_ban1/
├── assets/                         # Toàn bộ tài nguyên mã nguồn tĩnh (Static Assets)
│   ├── css/                        # Bảng mã phong cách giao diện (Stylesheets)
│   │   ├── style.css               # CSS chính cho toàn bộ 10 trang web (Master Gaming UI)
│   │   └── admin.css               # CSS chuyên biệt cho trang Quản trị Admin
│   └── js/                         # Mã nguồn logic JavaScript
│       ├── data/                   # Dữ liệu tĩnh lớn được tách rời độc lập (Clean Data Separation)
│       │   ├── news-data.js        # Dữ liệu bài viết tin tức các tựa game
│       │   ├── wiki-data.js        # CSDL Wiki tướng, trang bị, vũ khí (10.8k dòng dữ liệu)
│       │   └── roster-data.js      # CSDL Tuyển thủ, đội hình và tóm tắt trận đấu
│       ├── script.js               # Mã nguồn điều khiển logic chính (Đã tái cấu trúc v3.0)
│       └── admin.js                # Mã nguồn bảng điều khiển Admin
│
├── server/                         # Máy chủ Backend & Cơ sở dữ liệu tập trung
│   ├── templates/                  # Mẫu thư điện tử xác thực OTP
│   │   ├── esports_email_template.html   # Mẫu email thương hiệu ESPORTS ID chuẩn
│   │   └── riot_email_template.html      # Mẫu email dự phòng
│   ├── email_config.json           # Tệp lưu trữ thông tin cấu hình gửi email (SMTP/EmailJS)
│   └── esports.db                  # Cơ sở dữ liệu SQLite lưu tài khoản người dùng thực tế
│
├── docs/                           # Tài liệu hướng dẫn sử dụng & vận hành
│   ├── HUONG_DAN_CHO_NGUOI_KHAC_TRUY_CAP.md   # Hướng dẫn mở mạng LAN & Internet Tunnel
│   └── HUONG_DAN_GUI_EMAIL_THAT.md            # Hướng dẫn cài đặt Gmail SMTP & EmailJS
│
├── images/                         # Thư viện hình ảnh, avatar tuyển thủ, biểu tượng SVG
├── video/                          # Video nền Hero section (Liên Minh Huyền Thoại)
│
├── index.html                      # Trang chủ (Home)
├── account.html                    # Trang Cổng tài khoản ESPORTS ID & Bảo mật
├── admin.html                      # Trang Quản trị hệ thống (Admin Dashboard)
├── tournaments.html                # Trang Lịch thi đấu & Bảng đấu trực tiếp
├── roster.html                     # Trang Danh sách đội tuyển & Hồ sơ tuyển thủ
├── wiki.html                       # Trang Bách khoa toàn thư Wiki & Chi tiết tướng
├── news.html                       # Trang Tin tức Thể thao Điện tử
├── store.html                      # Trang Cửa hàng Gaming Gear & Quà lưu niệm
├── practice.html                   # Trang Phòng tập luyện phản xạ (Mini-game)
├── downloads.html                  # Trang Tải ứng dụng game & launcher
│
├── logo.svg                        # Biểu tượng SVG thương hiệu Esports (Shield + Gamepad)
├── CHAY_SERVER.bat                 # Trình khởi động tự động 1-Click (Server + Internet Tunnel)
├── server.py                       # Điểm khởi chạy máy chủ Python Backend chính
├── .gitignore                      # Cấu hình bỏ qua tệp nhị phân / dữ liệu nhạy cảm của Git
└── README.md                       # Tài liệu kiến trúc toàn diện của dự án
```

---

## ⚡ 4. HƯỚNG DẪN KHỞI CHẠY (HOW TO RUN)

### Cách 1: Khởi động 1-Click (Khuyên dùng cho Windows)
Chỉ cần nhấp đúp (Double-click) vào tệp **`CHAY_SERVER.bat`**:
1. Cửa sổ 1 sẽ tự động khởi động máy chủ Python trên cổng `8000`.
2. Cửa sổ 2 cho bạn chọn mở đường hầm ra Internet:
   * **Bấm phím 1 (Pinggy):** Cung cấp ngay đường link `https://xxxx.a.free.pinggy.link/account.html` để gửi cho bạn bè hoặc mở trên điện thoại bất kỳ.
   * **Bấm phím 2 (Cloudflare):** Tự động tải `cloudflared.exe` và tạo link `https://xxxx.trycloudflare.com/account.html` siêu tốc độ.

### Cách 2: Khởi chạy thủ công qua Terminal
Mở Command Prompt / PowerShell tại thư mục dự án:
```powershell
python server.py
```
Sau đó mở trình duyệt truy cập:
* Trang chủ: `http://localhost:8000/index.html`
* Cổng tài khoản: `http://localhost:8000/account.html`
* Trang quản trị: `http://localhost:8000/admin.html` (Đăng nhập: `AdminRoot` / Mật khẩu: `admin`)

---

## 🗄️ 5. LƯỢC ĐỒ CƠ SỞ DỮ LIỆU SQLITE (`esports.db`)

Hệ thống sử dụng SQLite 3 thuần túy tích hợp sẵn trong Python, không yêu cầu cài đặt MySQL hay PostgreSQL:

### Bảng `users` (Lưu trữ thông tin tài khoản)
| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | `INTEGER PRIMARY KEY` | Mã định danh tự tăng |
| `username` | `TEXT UNIQUE` | Tên đăng nhập duy nhất |
| `email` | `TEXT UNIQUE` | Địa chỉ email thật của người dùng |
| `password_hash` | `TEXT` | Mật khẩu mã hóa bảo mật SHA-256 |
| `game_name` | `TEXT` | Tên hiển thị trong game |
| `tagline` | `TEXT` | Mã thẻ định danh (Tagline, ví dụ: ADMIN, 2026) |
| `riot_id` | `TEXT` | Định danh toàn cầu (`game_name#tagline`) |
| `favorite_game` | `TEXT` | Tựa game yêu thích (LOL, Valorant, Liên Quân,...) |
| `avatar` | `TEXT` | Đường dẫn ảnh đại diện của game thủ |
| `balance` | `INTEGER` | Số dư ví điện tử web (VNĐ) |
| `two_factor_enabled` | `INTEGER` | Trạng thái bảo mật 2 lớp (1: Bật, 0: Tắt) |
| `email_verified` | `INTEGER` | Trạng thái xác minh email (1: Đã xác minh) |
| `role` | `TEXT` | Phân quyền tài khoản (`admin` hoặc `user`) |
| `created_at` | `TEXT` | Ngày tạo tài khoản định dạng DD/MM/YYYY |

### Bảng `otp_codes` (Quản lý mã xác thực đăng ký)
| Cột | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `email` | `TEXT PRIMARY KEY` | Email nhận mã xác thực |
| `code` | `TEXT` | Mã số OTP 6 chữ số |
| `expires_at` | `INTEGER` | Timestamp hết hạn mã (mặc định sau 10 phút) |
| `created_at` | `INTEGER` | Timestamp thời điểm tạo mã |

---

## 🌐 6. DANH SÁCH API ENDPOINTS (RESTFUL BACKEND)

| Phương thức | Endpoint | Chức năng | Body / Tham số |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/status` | Kiểm tra tình trạng server, số user, cấu hình SMTP | Không |
| `GET` | `/api/users` | Lấy danh sách thành viên công khai để đồng bộ UI | Không |
| `POST` | `/api/register` | Đăng ký tài khoản mới & xác minh OTP | `{username, email, password, favoriteGame, otpCode}` |
| `POST` | `/api/login` | Đăng nhập tài khoản & xác thực SHA-256 | `{usernameOrEmail, password}` |
| `POST` | `/api/send-otp` | Tạo mã OTP & gửi email xác thực thật | `{email, code, username}` |
| `POST` | `/api/update-profile` | Cập nhật hồ sơ (Game Name, Tagline, Avatar) | `{username, game_name, tagline, avatar, favorite_game}` |
| `GET` | `/api/config` | Đọc cấu hình email (ẩn mật khẩu vì lý do bảo mật) | Không |
| `POST` | `/api/save-config` | Lưu cấu hình Gmail SMTP hoặc EmailJS lên server | `{sender_email, sender_password, sender_name, emailjs}` |

---

## 💡 7. GHI CHÚ DÀNH CHO LẬP TRÌNH VIÊN (DEVELOPER NOTES)

1. **Khả năng tương thích ngược (Backward Compatibility):**
   * Các tệp gốc ở root (`style.css`, `script.js`, `admin.css`, `admin.js`) được thiết lập bộ điều hướng kế thừa (Proxy Wrappers). Bất kỳ trang nào gọi đường dẫn cũ hay mới đều chạy chính xác 100%.
   * `server.py` tích hợp bộ định tuyến tự động chuyển tiếp request `/style.css` $\rightarrow$ `/assets/css/style.css`.
2. **Tách rời dữ liệu (Data Separation):**
   * Hơn 13.000 dòng dữ liệu tĩnh (tướng, vật phẩm, tuyển thủ, bài viết) đã được đưa vào thư mục `assets/js/data/`.
   * Tệp `assets/js/script.js` chỉ giữ lại thuần túy logic xử lý (~4.400 dòng), có mục lục chi tiết đầu file giúp việc bảo trì, mở rộng tính năng mới cực kỳ nhanh chóng và rõ ràng.
3. **Không phụ thuộc thư viện nặng (Zero External Dependencies):**
   * Dự án không sử dụng npm packages hay node_modules, giúp mã nguồn nhẹ nhàng, tốc độ tải trang cực nhanh và chạy được trên mọi môi trường Python cơ bản.
