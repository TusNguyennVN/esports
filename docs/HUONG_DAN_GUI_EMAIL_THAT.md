# HƯỚNG DẪN KÍCH HOẠT GỬI EMAIL THẬT (MÃ ĐĂNG NHẬP ESPORTS ID)

Hệ thống đã được thiết kế và tích hợp chuẩn xác theo bố cục email xác thực tài khoản như hình ảnh bạn cung cấp, nhưng **được chuyển đổi 100% sang nhận diện thương hiệu dự án ESPORTS của bạn** (Logo khiên & gamepad Esports viền neon cyan, người gửi *ESPORTS ID*, tiêu đề *Mã Đăng Nhập*, khung chữ số OTP cách đều và cảnh báo bảo mật độc quyền).

Website hỗ trợ **2 cách thuận tiện nhất** để gửi email thật về hộp thư Gmail:

---

## 🚀 CÁCH 1: Dùng Python Server & Gmail SMTP (Khuyên dùng - Nhanh nhất)
*Ưu điểm: Không cần đăng ký dịch vụ bên ngoài, gửi email thật trực tiếp từ máy tính qua giao thức Google SMTP.*

### Bước 1: Lấy Mật khẩu ứng dụng (App Password) của Gmail (1 phút)
1. Truy cập vào: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   *(Lưu ý: Tài khoản Google của bạn cần bật Xác minh 2 bước)*
2. Nhập tên ứng dụng: `Esports Website` rồi bấm nút **Tạo**.
3. Google sẽ cấp cho bạn một chuỗi **16 chữ số** (ví dụ: `abcd efgh ijkl mnop`). Hãy sao chép chuỗi này.

### Bước 2: Điền thông tin vào `server/email_config.json`
Mở file `server/email_config.json` trong thư mục dự án và điền:
```json
{
  "smtp_server": "smtp.gmail.com",
  "smtp_port": 587,
  "sender_name": "ESPORTS",
  "sender_email": "dia-chi-gmail-cua-ban@gmail.com",
  "sender_password": "chuoi-16-chu-so-mat-khau-ung-dung",
  "emailjs": {
    "service_id": "",
    "template_id": "",
    "public_key": ""
  }
}
```
*(Bạn cũng có thể bấm nút **"Cấu hình gửi Email thật"** ngay trên giao diện trang `account.html` để nhập và lưu trực tiếp).*

### Bước 3: Khởi động Server
Mở Terminal / PowerShell tại thư mục dự án và gõ lệnh:
```bash
python server.py
```
Mở trình duyệt truy cập: **`http://localhost:8000/account.html`**
👉 Giờ đây, khi bạn nhập email thật và bấm **"Gửi mã xác nhận"**, một email thực tế mang thương hiệu ESPORTS ID sẽ ngay lập tức được gửi vào hòm thư Gmail của bạn!

---

## 🌐 CÁCH 2: Dùng EmailJS (Chạy tĩnh, không cần bật Python server)
*Ưu điểm: Thích hợp khi mở trực tiếp file HTML hoặc đưa website lên GitHub Pages, Vercel, Netlify.*

1. Đăng ký tài khoản miễn phí tại: [https://www.emailjs.com](https://www.emailjs.com) *(200 email/tháng miễn phí)*.
2. Vào mục **Email Services** > **Add New Service** > Chọn **Gmail** > Kết nối tài khoản Gmail của bạn. Bạn sẽ nhận được `Service ID`.
3. Vào mục **Email Templates** > **Create New Template**:
   - Tab **Settings**:
     - *To Email*: `{{to_email}}`
     - *Subject*: `Mã Đăng Nhập: {{otp_code}}`
   - Tab **Content**: Chuyển sang chế độ HTML và dán nội dung từ file `esports_email_template.html`.
   - Bấm **Save**, bạn sẽ nhận được `Template ID`.
4. Vào mục **Account** > **API Keys**: Sao chép `Public Key`.
5. Mở trang `account.html`, bấm nút **"Cấu hình gửi Email thật"** > chọn tab **2. EmailJS** > Dán 3 khóa trên vào rồi bấm **Lưu Cấu Hình**.

---

## 🎨 TÍNH NĂNG XEM TRƯỚC (PREVIEW) THÔNG MINH
- Khi bạn chưa kịp cài đặt tài khoản gửi email thật hoặc đang kiểm tra ngoại tuyến, hệ thống sẽ tự động hiển thị **Cửa sổ mô phỏng Gmail ESPORTS ID** tuyệt đẹp ngay trên màn hình (khớp bố cục ảnh chụp bạn gửi nhưng với logo và thương hiệu ESPORTS).
- Có sẵn nút **"Tự Động Điền Mã"** và **"Sao Chép Mã"** để việc kiểm tra luồng tạo tài khoản luôn mượt mà.
- Khi gửi email thật thành công, hệ thống sẽ hiển thị trạng thái màu xanh lá: `Đã gửi mã xác nhận thành công tới email của bạn`.
