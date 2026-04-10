import sqlite3
import os

DB_PATH = 'attendance.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin', 'faculty', 'student'))
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            roll_number TEXT UNIQUE NOT NULL,
            face_encoding TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            date TEXT NOT NULL,
            status TEXT NOT NULL,
            session_id TEXT NOT NULL,
            FOREIGN KEY (student_id) REFERENCES students (id)
        )
    ''')
    
    c.execute('SELECT * FROM users WHERE username = "admin"')
    if not c.fetchone():
        c.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ('admin', 'admin', 'admin'))
        
    c.execute('SELECT * FROM users WHERE username = "faculty"')
    if not c.fetchone():
        c.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ('faculty', 'faculty', 'faculty'))
        
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully.")
