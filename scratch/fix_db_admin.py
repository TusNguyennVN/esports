import sqlite3
import hashlib

def hash_pw(pw):
    return hashlib.sha256(pw.encode('utf-8')).hexdigest()

db_path = 'server/esports.db'
conn = sqlite3.connect(db_path)
c = conn.cursor()

# Check row 1
c.execute("SELECT id, username, email, password_hash, role FROM users")
rows = c.fetchall()
print("Before:", rows)

# Update row 1 username to 'admin' and password_hash to hash of 'Admin@Esports2026!'
# But our backend /api/login now supports BOTH Admin@Esports2026! and admin
c.execute("""
UPDATE users 
SET username = 'admin', 
    game_name = 'AdminRoot', 
    password_hash = ?, 
    role = 'admin' 
WHERE id = 1
""", (hash_pw('Admin@Esports2026!'),))
conn.commit()

c.execute("SELECT id, username, email, password_hash, role FROM users")
print("After:", c.fetchall())
conn.close()
