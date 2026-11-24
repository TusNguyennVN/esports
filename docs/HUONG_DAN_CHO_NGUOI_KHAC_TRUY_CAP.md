# HƯỚNG DẪN MỞ MÁY CHỦ THỰC TẾ CHO NGƯỜI KHÁC TẠO TÀI KHOẢN

Hệ thống của bạn đã được nâng cấp lên **Máy chủ thực tế (Real Backend Server)** kết nối với **Cơ sở dữ liệu tập trung `esports.db` (SQLite)**:
* Bất kỳ ai từ bất kỳ thiết bị nào (điện thoại iPhone/Android, laptop, máy tính khác) đều có thể tự tạo tài khoản riêng.
* Khi đăng ký, thông tin được lưu tập trung vào database trên server và mã OTP gửi về Gmail thật của người đăng ký.
* Người dùng có thể đăng nhập tài khoản của mình trên bất kỳ thiết bị nào!

---

## ⚡ CÁCH 1: DÙNG FILE TỰ ĐỘNG `CHAY_SERVER.bat` (KHUYÊN DÙNG - BẤM LÀ CHẠY)

Trong thư mục dự án đã có sẵn tệp: **`CHAY_SERVER.bat`**.

1. Nhấp đúp (Double-click) vào tệp **`CHAY_SERVER.bat`**.
2. Chương trình sẽ tự động:
   * **Mở cửa sổ 1**: Khởi chạy máy chủ Python Backend trên cổng 8000 kết nối SQLite Database.
   * **Mở cửa sổ 2**: Cho bạn 4 lựa chọn kết nối:
     * **[1] Pinggy (Khuyên dùng)**: Kết nối ngay lập tức qua lệnh SSH, không cần tải hay cài bất kỳ phần mềm nào, cấp link HTTPS ngay lập tức.
     * **[2] Cloudflare Tunnel**: Tự động tải `cloudflared.exe` và tạo link `https://xxx.trycloudflare.com` siêu ổn định.
     * **[3] Localhost.run**: Kết nối qua localhost.run có kèm chống timeout.
     * **[4] Chỉ dùng nội bộ**: Dành cho cùng mạng Wi-Fi LAN.
3. Khi màn hình hiện ra đường link HTTPS (ví dụ `https://xxxx.a.free.pinggy.link`), bạn chỉ cần copy link đó và thêm `/account.html` vào cuối:
   ```text
   https://xxxx.a.free.pinggy.link/account.html
   ```
4. Gửi link đó cho bạn bè mở trên điện thoại hoặc máy tính để họ đăng ký tài khoản!

---

## 🚀 CÁCH 2: Chạy thủ công bằng dòng lệnh (Nếu thích dùng Terminal)

> **QUAN TRỌNG:** Phải mở **2 cửa sổ Terminal song song**! Không được tắt cửa sổ nào trong lúc người khác đang dùng:

### Cửa sổ 1: Bật máy chủ Python (Bắt buộc phải bật trước)
Mở Terminal trong thư mục dự án và chạy:
```powershell
python server.py
```
*(Cửa sổ này sẽ hiển thị toàn bộ hoạt động: ai đăng nhập, ai đăng ký, OTP gửi về email nào)*

### Cửa sổ 2: Mở đường hầm Internet công khai
Mở thêm một cửa sổ Terminal/Command Prompt thứ 2 và chạy **MỘT** trong các lệnh sau:

#### Lựa chọn A: Dùng Pinggy (Nhanh nhất - Không cần cài đặt gì)
```powershell
ssh -p 443 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R0:localhost:8000 a.pinggy.io
```
Nhận link dạng: `https://xxxx.a.free.pinggy.link/account.html` gửi cho mọi người.

#### Lựa chọn B: Dùng Cloudflare Tunnel
Chạy lệnh tải công cụ một lần duy nhất:
```powershell
curl.exe -Lo cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
```
Sau đó chạy đường hầm:
```powershell
.\cloudflared.exe tunnel --url http://localhost:8000
```
Nhận link dạng: `https://xxxx.trycloudflare.com/account.html` gửi cho mọi người.

---

## 📱 CÁCH 3: Cho người khác cùng mạng Wi-Fi (LAN)
Nếu bạn bè hoặc người thân đang kết nối **chung mạng Wi-Fi** với bạn:
1. Khi chạy `python server.py`, màn hình sẽ hiện dòng:
   ```text
   📱 Người khác truy cập (cùng Wi-Fi): http://192.168.x.x:8000/account.html
   ```
2. Gửi link `http://192.168.x.x:8000/account.html` cho họ mở trên điện thoại là dùng được ngay, không cần kết nối Internet tunnel!

---

## 💾 Dữ liệu tài khoản được quản lý ở đâu?
* Toàn bộ tài khoản của mọi người đăng ký đều được lưu tại tệp **`server/esports.db`** (SQLite).
* Dữ liệu tồn tại vĩnh viễn, tắt máy bật lại vẫn còn nguyên!
* Bạn có thể xem và quản lý danh sách thành viên trên trang Quản trị: `admin.html`.
