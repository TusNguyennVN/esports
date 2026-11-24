@echo off
chcp 65001 >nul
title ESPORTS SERVER - TRÌNH KHỞI ĐỘNG HỆ THỐNG
cls

echo ==============================================================================
echo        🎮 HỆ THỐNG MÁY CHỦ ESPORTS WEBSITE (REAL MULTI-USER DATABASE)
echo ==============================================================================
echo.
echo  [1/2] Đang khởi động máy chủ Python Backend trên cổng 8000...
start "Esports Python Server (Port 8000)" cmd /k "cd /d "%~dp0" && python server.py"
timeout /t 2 /nobreak >nul
echo  [OK] Máy chủ Python đã được bật trong cửa sổ riêng!
echo.
echo ==============================================================================
echo    CHỌN CÁCH ĐỂ NGƯỜI KHÁC TRUY CẬP VÀ ĐĂNG KÝ TÀI KHOẢN TỪ MỌI THIẾT BỊ:
echo ==============================================================================
echo.
echo    [1] DÙNG PINGGY (KHUYÊN DÙNG - Nhanh nhất, không cần cài đặt, có HTTPS ngay)
echo    [2] DÙNG CLOUDFLARE TUNNEL (Cực kỳ mượt và bảo mật - tự tải cloudflared.exe)
echo    [3] DÙNG LOCALHOST.RUN (Đã thêm cơ chế chống timeout)
echo    [4] CHỈ DÙNG NỘI BỘ (Chỉ máy tính này hoặc cùng mạng Wi-Fi LAN)
echo.
echo ==============================================================================
set /p choice="👉 Nhập số 1, 2, 3 hoặc 4 rồi nhấn Enter (Mặc định là 1): "

if "%choice%"=="2" goto CLOUDFLARE
if "%choice%"=="3" goto LOCALHOSTRUN
if "%choice%"=="4" goto LOCALONLY
goto PINGGY

:PINGGY
cls
echo ==============================================================================
echo    🚀 ĐANG KẾT NỐI ĐƯỜNG HẦM INTERNET PINGGY (MIỄN PHÍ, CÓ HTTPS)...
echo ==============================================================================
echo.
echo    📌 HƯỚNG DẪN:
echo    1. Đợi vài giây, màn hình bên dưới sẽ hiện ra bảng trạng thái.
echo    2. Tìm dòng có chứa liên kết dạng:
echo          https://xxxx.a.free.pinggy.link
echo    3. Bạn chỉ cần COPY liên kết đó và THÊM /account.html vào cuối:
echo          Ví dụ: https://xxxx.a.free.pinggy.link/account.html
echo    4. Gửi link đó cho bạn bè trên điện thoại hoặc máy tính khác để họ tạo tài khoản!
echo.
echo    (Lưu ý: Giữ cửa sổ này mở trong suốt lúc người khác truy cập)
echo ------------------------------------------------------------------------------
ssh -p 443 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R0:localhost:8000 a.pinggy.io
pause
goto END

:CLOUDFLARE
cls
echo ==============================================================================
echo    ☁️ ĐANG KHỞI CHẠY CLOUDFLARE TUNNEL...
echo ==============================================================================
if not exist "%~dp0cloudflared.exe" (
    echo [!] Chưa thấy tệp cloudflared.exe. Đang tự động tải về thư mục dự án (khoảng 30MB)...
    curl.exe -Lo "%~dp0cloudflared.exe" "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
    if not exist "%~dp0cloudflared.exe" (
        echo [X] Không thể tải tự động. Bạn hãy quay lại chọn mục 1 (Pinggy) nhé!
        pause
        goto END
    )
    echo [OK] Tải cloudflared.exe thành công!
)
echo.
echo 📌 HƯỚNG DẪN:
echo    Tìm dòng có dạng: https://xxxx.trycloudflare.com
echo    Copy link đó thêm /account.html và gửi cho mọi người!
echo ------------------------------------------------------------------------------
"%~dp0cloudflared.exe" tunnel --url http://localhost:8000
pause
goto END

:LOCALHOSTRUN
cls
echo ==============================================================================
echo    🌐 ĐANG KẾT NỐI LOCALHOST.RUN (CHỐNG TIMEOUT)...
echo ==============================================================================
echo.
echo 📌 HƯỚNG DẪN:
echo    Tìm liên kết có dạng: https://xxxx.lhr.life
echo    Copy link đó thêm /account.html và gửi cho mọi người!
echo ------------------------------------------------------------------------------
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:localhost:8000 nokey@localhost.run
pause
goto END

:LOCALONLY
cls
echo ==============================================================================
echo    🏠 MÁY CHỦ ĐANG CHẠY Ở CHẾ ĐỘ NỘI BỘ (LAN WI-FI)
echo ==============================================================================
echo.
echo Bạn và bạn bè bắt chung Wi-Fi có thể truy cập bằng địa chỉ IP máy tính của bạn.
echo Hãy xem địa chỉ truy cập trên cửa sổ "Esports Python Server (Port 8000)" đang chạy!
echo.
pause
goto END

:END
