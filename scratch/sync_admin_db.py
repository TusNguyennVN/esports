import sqlite3
import os
import hashlib

def hash_pw(pw):
    return hashlib.sha256(pw.encode('utf-8')).hexdigest()

for db_path in ['server/esports.db', 'esports.db']:
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute("SELECT id, username, password_hash FROM users WHERE LOWER(username) IN ('admin', 'adminroot')")
        rows = c.fetchall()
        print(f"Current admin rows in {db_path}: {rows}")
        
        # Check if 'admin' exists
        c.execute("SELECT id FROM users WHERE LOWER(username) = 'admin'")
        if not c.fetchone():
            c.execute("""
            INSERT INTO users (username, email, password_hash, game_name, tagline, riot_id, favorite_game, avatar, balance, two_factor_enabled, email_verified, role, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                'admin', 'admin@esports.gg', hash_pw('Admin@Esports2026!'),
                'AdminRoot', 'ADMIN', 'AdminRoot#ADMIN', 'League of Legends',
                'images/faker_league_of_legends_esports.png', 100099000,
                1, 1, 'admin', '22/11/2026'
            ))
            conn.commit()
            print(f"Added 'admin' user to {db_path}")

        # Update AdminRoot password to also support 'Admin@Esports2026!' if queried
        c.execute("UPDATE users SET role = 'admin' WHERE LOWER(username) IN ('admin', 'adminroot')")
        conn.commit()
        
        c.execute("SELECT id, username, email, role FROM users")
        print(f"Final users in {db_path}: {c.fetchall()}")
        conn.close()
