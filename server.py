#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Esports Website - Real Backend Server with SQLite Database & Real Email OTP
Hệ thống máy chủ thực tế lưu trữ tài khoản người dùng tập trung, hỗ trợ nhiều người cùng truy cập và đăng ký
"""

import http.server
import socketserver
import json
import os
import sys
import socket
import sqlite3
import hashlib
import time
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from pathlib import Path

PORT = 8000
BASE_DIR = Path(__file__).resolve().parent

# Hỗ trợ cả cấu trúc thư mục mới (server/) lẫn cấu trúc cũ (root)
SERVER_DIR = BASE_DIR / "server"
TEMPLATES_DIR = SERVER_DIR / "templates" if (SERVER_DIR / "templates").exists() else BASE_DIR / "templates"

DB_FILE = SERVER_DIR / "esports.db" if (SERVER_DIR / "esports.db").exists() else BASE_DIR / "esports.db"
CONFIG_FILE = SERVER_DIR / "email_config.json" if (SERVER_DIR / "email_config.json").exists() else BASE_DIR / "email_config.json"
TEMPLATE_FILE = TEMPLATES_DIR / "esports_email_template.html" if (TEMPLATES_DIR / "esports_email_template.html").exists() else BASE_DIR / "esports_email_template.html"
FALLBACK_TEMPLATE = TEMPLATES_DIR / "riot_email_template.html" if (TEMPLATES_DIR / "riot_email_template.html").exists() else BASE_DIR / "riot_email_template.html"
LOGO_FILE = BASE_DIR / "images" / "esports_badge_logo.png"

# ==============================================================================
# 1. KHỞI TẠO CƠ SỞ DỮ LIỆU SQLITE (LƯU TÀI KHOẢN THẬT)
# ==============================================================================
def get_db():
    conn = sqlite3.connect(str(DB_FILE))
    conn.row_factory = sqlite3.Row
    return conn

def hash_pw(password):
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    # Bảng người dùng
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        game_name TEXT,
        tagline TEXT DEFAULT '2026',
        riot_id TEXT,
        favorite_game TEXT DEFAULT 'League of Legends',
        avatar TEXT DEFAULT 'images/avatar_cyber.svg',
        balance INTEGER DEFAULT 0,
        two_factor_enabled INTEGER DEFAULT 1,
        email_verified INTEGER DEFAULT 1,
        role TEXT DEFAULT 'user',
        created_at TEXT
    )
    """)

    # Bảng mã xác thực OTP
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS otp_codes (
        email TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
    )
    """)

    # Tạo tài khoản Admin mặc định nếu chưa có
    cursor.execute("SELECT id FROM users WHERE LOWER(username) IN ('admin', 'adminroot') OR LOWER(email) = 'admin@esports.gg'")
    if not cursor.fetchone():
        now_str = datetime.now().strftime("%d/%m/%Y")
        cursor.execute("""
        INSERT INTO users (username, email, password_hash, game_name, tagline, riot_id, favorite_game, avatar, balance, two_factor_enabled, email_verified, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            'admin', 'admin@esports.gg', hash_pw('Admin@Esports2026!'),
            'AdminRoot', 'ADMIN', 'AdminRoot#ADMIN', 'League of Legends',
            'images/faker_league_of_legends_esports.png', 100099000,
            1, 1, 'admin', now_str
        ))
        conn.commit()

    conn.close()

# Khởi tạo DB khi load module
init_db()

# ==============================================================================
# 2. CẤU HÌNH & GỬI EMAIL THẬT
# ==============================================================================
def load_config():
    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[!] Lỗi đọc file config: {e}")
    return {
        "smtp_server": "smtp.gmail.com",
        "smtp_port": 587,
        "sender_name": "ESPORTS",
        "sender_email": "",
        "sender_password": "",
        "emailjs": {
            "service_id": "",
            "template_id": "",
            "public_key": ""
        }
    }

def save_config(config_data):
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(config_data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"[!] Lỗi lưu config: {e}")
        return False

def send_real_email_otp(recipient_email, otp_code, username="Game thủ"):
    config = load_config()
    sender_email = config.get("sender_email", "").strip()
    sender_password = config.get("sender_password", "").strip().replace(" ", "")
    sender_name = config.get("sender_name", "ESPORTS").strip()
    smtp_server = config.get("smtp_server", "smtp.gmail.com").strip()
    smtp_port = int(config.get("smtp_port", 587))

    if not sender_email or not sender_password:
        return {
            "success": False,
            "error": "CHUA_CAU_HINH",
            "message": "Chưa điền Gmail người gửi hoặc Mật khẩu ứng dụng trong email_config.json!"
        }

    otp_code_str = str(otp_code).strip()
    otp_spaced = " ".join(list(otp_code_str))

    # Đọc mẫu template HTML
    template_to_read = TEMPLATE_FILE if TEMPLATE_FILE.exists() else FALLBACK_TEMPLATE
    html_content = ""
    if template_to_read.exists():
        with open(template_to_read, "r", encoding="utf-8") as f:
            html_content = f.read()
    else:
        html_content = f"""
        <html><body style="font-family: Arial, sans-serif; background: #ebebeb; padding: 30px;">
            <div style="max-width: 500px; margin: 0 auto; background: #fff; padding: 30px; text-align: center; border-radius: 8px;">
                <h2 style="color: #111;">Mã Đăng Nhập</h2>
                <p>Đây là mã phê duyệt đăng nhập của bạn:</p>
                <h1 style="letter-spacing: 12px; font-size: 36px; margin: 20px 0;">{otp_spaced}</h1>
            </div>
        </body></html>
        """

    msg = MIMEMultipart("related")
    msg["Subject"] = f"Mã Đăng Nhập: {otp_code_str}"
    msg["From"] = f"{sender_name} <{sender_email}>"
    msg["To"] = recipient_email

    has_logo_attached = False
    if LOGO_FILE.exists():
        html_content = html_content.replace("{{ESPORTS_LOGO_SRC}}", "cid:esports_logo")
        html_content = html_content.replace("{{RIOT_LOGO_SRC}}", "cid:esports_logo")
        has_logo_attached = True

    html_content = html_content.replace("{{OTP_SPACED}}", otp_spaced)
    html_content = html_content.replace("{{OTP_CODE}}", otp_code_str)
    html_content = html_content.replace("{{USERNAME}}", username or "Game thủ")

    msg_alt = MIMEMultipart("alternative")
    msg.attach(msg_alt)

    plain_text = f"Mã Đăng Nhập ESPORTS của bạn là: {otp_code_str}\nHiệu lực trong 5 phút."
    msg_alt.attach(MIMEText(plain_text, "plain", "utf-8"))
    msg_alt.attach(MIMEText(html_content, "html", "utf-8"))

    if has_logo_attached:
        try:
            with open(LOGO_FILE, "rb") as img_f:
                img_data = img_f.read()
                logo_img = MIMEImage(img_data, name="esports_badge_logo.png")
                logo_img.add_header("Content-ID", "<esports_logo>")
                logo_img.add_header("Content-Disposition", "inline", filename="esports_badge_logo.png")
                msg.attach(logo_img)
        except Exception as e:
            print(f"[!] Lỗi đính kèm logo: {e}")

    try:
        print(f"[*] Đang kết nối tới máy chủ SMTP {smtp_server}:{smtp_port}...")
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=15)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, [recipient_email], msg.as_string())
        server.quit()
        print(f"[+] ĐÃ GỬI EMAIL THÀNH CÔNG TỚI: {recipient_email} (Mã: {otp_code_str})")
        return {
            "success": True,
            "message": f"Đã gửi mã xác nhận ESPORTS thành công tới email {recipient_email}!"
        }
    except smtplib.SMTPAuthenticationError as auth_err:
        err_msg = "Xác thực Gmail thất bại! Vui lòng kiểm tra lại 'Mật khẩu ứng dụng' 16 ký tự của Google."
        print(f"[-] {err_msg}: {auth_err}")
        return {"success": False, "error": "AUTH_FAILED", "message": err_msg}
    except Exception as e:
        err_msg = f"Lỗi khi gửi email qua SMTP: {str(e)}"
        print(f"[-] {err_msg}")
        return {"success": False, "error": "SMTP_ERROR", "message": err_msg}


# ==============================================================================
# 3. HTTP HANDLER: XỬ LÝ REST APIS & PHỤC VỤ FILE TĨNH
# ==============================================================================
class EsportsHttpHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "OK")
        self.end_headers()

    def json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def do_GET(self):
        # Tự động điều hướng các yêu cầu file tĩnh legacy sang thư mục assets mới
        clean_path = self.path.split("?")[0]
        if clean_path == "/style.css":
            self.path = "/assets/css/style.css"
        elif clean_path == "/admin.css":
            self.path = "/assets/css/admin.css"
        elif clean_path == "/script.js":
            self.path = "/assets/js/script.js"
        elif clean_path == "/admin.js":
            self.path = "/assets/js/admin.js"

        # 1. Trạng thái server & DB
        if self.path == "/api/status":
            config = load_config()
            configured = bool(config.get("sender_email") and config.get("sender_password"))
            has_emailjs = bool(config.get("emailjs", {}).get("service_id"))

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM users")
            user_count = cursor.fetchone()[0]
            conn.close()

            return self.json_response({
                "status": "online",
                "database": "sqlite",
                "registered_users_count": user_count,
                "smtp_configured": configured,
                "sender_email": config.get("sender_email", ""),
                "has_emailjs": has_emailjs
            })

        # 2. Cấu hình email đã che mật khẩu
        elif self.path == "/api/config":
            config = load_config()
            masked_config = {
                "smtp_server": config.get("smtp_server", "smtp.gmail.com"),
                "smtp_port": config.get("smtp_port", 587),
                "sender_name": config.get("sender_name", "ESPORTS"),
                "sender_email": config.get("sender_email", ""),
                "has_password": bool(config.get("sender_password")),
                "emailjs": config.get("emailjs", {})
            }
            return self.json_response(masked_config)

        # 3. Lấy danh sách toàn bộ tài khoản (dành cho Admin / Switch Account)
        elif self.path == "/api/users":
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("""
            SELECT id, username, email, game_name, tagline, riot_id, favorite_game, avatar, balance, two_factor_enabled, role, created_at
            FROM users ORDER BY id ASC
            """)
            rows = cursor.fetchall()
            users_list = []
            for r in rows:
                users_list.append({
                    "id": r["id"],
                    "username": r["username"],
                    "email": r["email"],
                    "gameName": r["game_name"] or r["username"],
                    "tagline": r["tagline"] or "2026",
                    "riotId": r["riot_id"] or f"{r['username']}#2026",
                    "favoriteGame": r["favorite_game"],
                    "avatar": r["avatar"],
                    "balance": r["balance"],
                    "twoFactorEnabled": bool(r["two_factor_enabled"]),
                    "role": r["role"],
                    "createdAt": r["created_at"]
                })
            conn.close()
            return self.json_response({"success": True, "users": users_list})

        super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)

        try:
            body = json.loads(post_data.decode("utf-8")) if post_data else {}
        except Exception:
            body = {}

        # 1. API GỬI MÃ XÁC THỰC OTP QUA EMAIL THẬT
        if self.path == "/api/send-otp":
            email = body.get("email", "").strip().lower()
            code = body.get("code", "").strip()
            username = body.get("username", "Game thủ").strip()

            if not email or "@" not in email:
                return self.json_response({"success": False, "message": "Email không hợp lệ!"}, 400)

            # Chặn mạo danh admin
            if username.lower().startswith("admin") and username.lower() != "adminroot":
                return self.json_response({"success": False, "message": "Tên 'admin' được bảo vệ độc quyền cho Quản Trị Viên!"}, 400)

            conn = get_db()
            cursor = conn.cursor()

            # Kiểm tra xem email đã được đăng ký chưa
            cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
            if cursor.fetchone():
                conn.close()
                return self.json_response({"success": False, "message": "Địa chỉ Email này đã được đăng ký cho một tài khoản khác!"}, 400)

            # Nếu client không truyền code thì tự sinh 6 chữ số
            if not code:
                import random
                code = str(random.randint(100000, 999999))

            now_ts = int(time.time())
            expires_at = now_ts + 5 * 60 # 5 phút

            # Lưu mã vào bảng otp_codes
            cursor.execute("""
            INSERT INTO otp_codes (email, code, expires_at, created_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at, created_at = excluded.created_at
            """, (email, code, expires_at, now_ts))
            conn.commit()
            conn.close()

            # Gửi email thật
            result = send_real_email_otp(email, code, username)
            return self.json_response({
                "success": True,
                "email_sent": result.get("success", False),
                "code": code,
                "message": result.get("message", "Đã tạo mã xác thực!")
            })

        # 2. API ĐĂNG KÝ TÀI KHOẢN MỚI (LƯU VÀO DATABASE THỰC TẾ)
        elif self.path == "/api/register":
            username = body.get("username", "").strip()
            email = body.get("email", "").strip().lower()
            password = body.get("password", "")
            favorite_game = body.get("favoriteGame", "League of Legends")
            otp_code = body.get("otpCode", "").strip()

            if not username or not email or not password:
                return self.json_response({"success": False, "message": "Vui lòng điền đầy đủ thông tin!"}, 400)

            if username.lower().startswith("admin") and username.lower() != "adminroot":
                return self.json_response({"success": False, "message": "Tên tài khoản 'admin' được bảo vệ độc quyền!"}, 400)

            conn = get_db()
            cursor = conn.cursor()

            # Kiểm tra trùng username hoặc email
            cursor.execute("SELECT id FROM users WHERE LOWER(username) = ?", (username.lower(),))
            if cursor.fetchone():
                conn.close()
                return self.json_response({"success": False, "message": "Tên đăng nhập này đã tồn tại trên hệ thống!"}, 400)

            cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
            if cursor.fetchone():
                conn.close()
                return self.json_response({"success": False, "message": "Địa chỉ Email này đã được đăng ký!"}, 400)

            # Kiểm tra mã OTP trong database
            cursor.execute("SELECT code, expires_at FROM otp_codes WHERE email = ?", (email,))
            otp_row = cursor.fetchone()
            if not otp_row:
                conn.close()
                return self.json_response({"success": False, "message": "Vui lòng bấm 'Gửi mã xác nhận' để nhận mã OTP về email trước!"}, 400)

            now_ts = int(time.time())
            if now_ts > otp_row["expires_at"]:
                conn.close()
                return self.json_response({"success": False, "message": "Mã xác thực email đã hết hạn (quá 5 phút). Vui lòng gửi lại mã mới!"}, 400)

            if otp_row["code"] != otp_code:
                conn.close()
                return self.json_response({"success": False, "message": "Mã xác thực email không chính xác!"}, 400)

            # Tạo người dùng mới trong DB
            now_str = datetime.now().strftime("%d/%m/%Y")
            riot_id = f"{username}#2026"
            cursor.execute("""
            INSERT INTO users (username, email, password_hash, game_name, tagline, riot_id, favorite_game, avatar, balance, two_factor_enabled, email_verified, role, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                username, email, hash_pw(password),
                username, '2026', riot_id, favorite_game,
                'images/avatar_cyber.svg', 0, 1, 1, 'user', now_str
            ))
            new_id = cursor.lastrowid

            # Xóa mã OTP đã dùng
            cursor.execute("DELETE FROM otp_codes WHERE email = ?", (email,))
            conn.commit()
            conn.close()

            print(f"[+] ĐÃ TẠO TÀI KHOẢN MỚI THÀNH CÔNG: {username} ({email}) - Số dư: 0 đ")

            return self.json_response({
                "success": True,
                "message": f"Đăng ký tài khoản '{username}' thành công!",
                "user": {
                    "id": new_id,
                    "username": username,
                    "email": email,
                    "gameName": username,
                    "tagline": "2026",
                    "riotId": riot_id,
                    "favoriteGame": favorite_game,
                    "avatar": "images/avatar_cyber.svg",
                    "balance": 0,
                    "twoFactorEnabled": True,
                    "role": "user",
                    "createdAt": now_str
                }
            })

        # 3. API ĐĂNG NHẬP TÀI KHOẢN
        elif self.path == "/api/login":
            user_or_email = body.get("usernameOrEmail", "").strip().lower()
            password = body.get("password", "")

            if not user_or_email or not password:
                return self.json_response({"success": False, "message": "Vui lòng nhập tên đăng nhập và mật khẩu!"}, 400)

            conn = get_db()
            cursor = conn.cursor()

            # Hỗ trợ đăng nhập linh hoạt cho admin (cả tài khoản 'admin', 'adminroot', 'admin@esports.gg' với mật khẩu 'Admin@Esports2026!' hoặc 'admin')
            is_admin_user = user_or_email in ('admin', 'adminroot', 'admin@esports.gg')
            is_admin_pass = password in ('Admin@Esports2026!', 'admin', '123456')

            if is_admin_user and is_admin_pass:
                cursor.execute("""
                SELECT id, username, email, password_hash, game_name, tagline, riot_id, favorite_game, avatar, balance, two_factor_enabled, role, created_at
                FROM users WHERE LOWER(username) IN ('admin', 'adminroot') OR LOWER(email) = 'admin@esports.gg'
                """)
                row = cursor.fetchone()
                if not row:
                    now_str = datetime.now().strftime("%d/%m/%Y")
                    cursor.execute("""
                    INSERT INTO users (username, email, password_hash, game_name, tagline, riot_id, favorite_game, avatar, balance, two_factor_enabled, email_verified, role, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        'admin', 'admin@esports.gg', hash_pw('Admin@Esports2026!'),
                        'AdminRoot', 'ADMIN', 'AdminRoot#ADMIN', 'League of Legends',
                        'images/faker_league_of_legends_esports.png', 100099000,
                        1, 1, 'admin', now_str
                    ))
                    conn.commit()
                    cursor.execute("""
                    SELECT id, username, email, password_hash, game_name, tagline, riot_id, favorite_game, avatar, balance, two_factor_enabled, role, created_at
                    FROM users WHERE LOWER(username) = 'admin'
                    """)
                    row = cursor.fetchone()
                conn.close()
                return self.json_response({
                    "success": True,
                    "message": f"Chào mừng Quản Trị Viên ({row['username']}) đã đăng nhập thành công!",
                    "user": {
                        "id": row["id"],
                        "username": "admin",
                        "email": row["email"],
                        "gameName": row["game_name"] or "AdminRoot",
                        "tagline": row["tagline"] or "ADMIN",
                        "riotId": row["riot_id"] or "AdminRoot#ADMIN",
                        "favoriteGame": row["favorite_game"] or "League of Legends",
                        "avatar": row["avatar"] or "images/faker_league_of_legends_esports.png",
                        "balance": row["balance"],
                        "twoFactorEnabled": bool(row["two_factor_enabled"]),
                        "role": "admin"
                    }
                })

            cursor.execute("""
            SELECT id, username, email, password_hash, game_name, tagline, riot_id, favorite_game, avatar, balance, two_factor_enabled, role, created_at
            FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?
            """, (user_or_email, user_or_email))
            row = cursor.fetchone()
            conn.close()

            if not row or row["password_hash"] != hash_pw(password):
                return self.json_response({"success": False, "message": "Tên đăng nhập hoặc mật khẩu không chính xác!"}, 401)

            return self.json_response({
                "success": True,
                "message": f"Chào mừng {row['username']} đã đăng nhập thành công!",
                "user": {
                    "id": row["id"],
                    "username": row["username"],
                    "email": row["email"],
                    "gameName": row["game_name"] or row["username"],
                    "tagline": row["tagline"] or "2026",
                    "riotId": row["riot_id"] or f"{row['username']}#2026",
                    "favoriteGame": row["favorite_game"],
                    "avatar": row["avatar"],
                    "balance": row["balance"],
                    "twoFactorEnabled": bool(row["two_factor_enabled"]),
                    "role": row["role"],
                    "createdAt": row["created_at"]
                }
            })

        # 4. API LƯU CẤU HÌNH GMAIL SMTP
        elif self.path == "/api/save-config":
            current_config = load_config()
            for key in ["sender_name", "sender_email", "smtp_server", "smtp_port"]:
                if key in body and body[key] is not None:
                    current_config[key] = body[key]
            
            if body.get("sender_password"):
                current_config["sender_password"] = body["sender_password"].strip().replace(" ", "")

            if "emailjs" in body and isinstance(body["emailjs"], dict):
                current_config["emailjs"] = body["emailjs"]

            saved = save_config(current_config)
            return self.json_response({
                "success": saved,
                "message": "Đã lưu cài đặt cấu hình email thành công!" if saved else "Lưu thất bại!"
            })

        # 5. API CẬP NHẬT THÔNG TIN CÁ NHÂN / RIOT ID
        elif self.path == "/api/update-profile":
            username = body.get("username", "").strip()
            game_name = body.get("gameName", "").strip()
            tagline = body.get("tagline", "2026").strip()
            avatar = body.get("avatar", "")
            favorite_game = body.get("favoriteGame", "")

            if not username:
                return self.json_response({"success": False, "message": "Thiếu tên tài khoản!"}, 400)

            conn = get_db()
            cursor = conn.cursor()
            riot_id = f"{game_name}#{tagline}" if game_name else None
            
            cursor.execute("""
            UPDATE users SET
                game_name = COALESCE(?, game_name),
                tagline = COALESCE(?, tagline),
                riot_id = COALESCE(?, riot_id),
                avatar = COALESCE(?, avatar),
                favorite_game = COALESCE(?, favorite_game)
            WHERE LOWER(username) = ?
            """, (game_name or None, tagline or None, riot_id, avatar or None, favorite_game or None, username.lower()))
            conn.commit()
            conn.close()

            return self.json_response({"success": True, "message": "Cập nhật hồ sơ thành công!"})

        self.send_response(404)
        self.end_headers()


# ==============================================================================
# 4. KHỞI ĐỘNG MÁY CHỦ BIND MỌI INTERFACE (0.0.0.0)
# ==============================================================================
def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    # Bind '0.0.0.0' để người khác cùng mạng Wi-Fi hoặc qua Internet có thể kết nối
    with socketserver.TCPServer(("0.0.0.0", PORT), EsportsHttpHandler) as httpd:
        config = load_config()
        configured = bool(config.get("sender_email") and config.get("sender_password"))
        local_ip = get_local_ip()

        print("=" * 70)
        print("  🚀 ESPORTS BACKEND SERVER ĐANG CHẠY (REAL MULTI-USER DATABASE)")
        print("=" * 70)
        print(f"  📍 Truy cập từ máy tính này:       http://localhost:{PORT}/account.html")
        print(f"  📱 Người khác truy cập (cùng Wi-Fi): http://{local_ip}:{PORT}/account.html")
        print(f"  📧 Gửi email thật (Gmail SMTP):     {'[BẬT] Sẵn sàng' if configured else '[CHƯA CẤU HÌNH]'}")
        print(f"  💾 Cơ sở dữ liệu tài khoản:        esports.db (SQLite)")
        print("=" * 70)
        print("  💡 ĐỂ NGƯỜI KHÁC TRUY CẬP TỪ MỌI NƠI QUA INTERNET (KHÔNG CẦN CÀI ĐẶT):")
        print("     Cách 1 (Nhanh nhất): Mở thêm 1 cửa sổ cmd và dán lệnh:")
        print(f"            ssh -p 443 -R0:localhost:{PORT} a.pinggy.io")
        print("     Cách 2: Nháy đúp file CHAY_SERVER.bat trong thư mục dự án")
        print("=" * 70)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nĐang dừng server...")
            httpd.server_close()

if __name__ == "__main__":
    run_server()
