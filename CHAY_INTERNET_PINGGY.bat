@echo off
chcp 65001 >nul
title KẾT NỐI INTERNET CHO ESPORTS WEBSITE (PINGGY TUNNEL)
cls

echo ==============================================================================
echo        🎮 HỆ THỐNG MÁY CHỦ ESPORTS WEBSITE - KẾT NỐI INTERNET
echo ==============================================================================
echo.
echo [1/2] Đang kiểm tra và khởi động máy chủ Python Backend (Port 8000)...
start "Esports Python Server (Port 8000)" cmd /k "cd /d "%~dp0" && python server.py"
timeout /t 2 /nobreak >nul
echo [OK] Máy chủ Python đã hoạt động!
echo.
echo [2/2] Đang kết nối đường hầm Internet Pinggy (Miễn phí, có HTTPS)...
echo.
echo ==============================================================================
echo 📌 HƯỚNG DẪN LẤY LIÊN KẾT ĐỂ GỬI CHO BẠN BÈ / ĐIỆN THOẠI:
echo    1. Nhìn dòng có dạng: https://xxxx.a.free.pinggy.link
echo    2. Copy link đó gửi cho bạn bè để truy cập từ bất kỳ đâu trên thế giới!
echo    3. Giữ cửa sổ này mở trong suốt lúc người khác truy cập.
echo ==============================================================================
echo.
ssh -p 443 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R0:localhost:8000 a.pinggy.io
pause
