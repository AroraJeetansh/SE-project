from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, get_db_connection
import face_service
import json
import os

app = Flask(__name__)

allowed_origins_raw = os.getenv('CORS_ORIGIN', '').strip()
if allowed_origins_raw:
    allowed_origins = [o.strip().rstrip('/') for o in allowed_origins_raw.split(',') if o.strip()]
    CORS(
        app,
        resources={r"/api/*": {"origins": allowed_origins}},
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )
else:
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )

init_db()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, password)).fetchone()
    conn.close()
    
    if user:
        return jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'role': user['role']
            }
        })
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/students/register', methods=['POST'])
def register_student():
    data = request.json
    name = data.get('name')
    roll_number = data.get('roll_number')
    face_image = data.get('face_image')
    
    if not all([name, roll_number, face_image]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    enc_res = face_service.get_face_encoding(face_image)
    if not enc_res['success']:
        return jsonify(enc_res), 400
    
    encoding_str = json.dumps(enc_res['encoding'])

    conn = get_db_connection()
    import sqlite3
    try:
        cursor = conn.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', (roll_number, roll_number, 'student'))
        user_id = cursor.lastrowid
        conn.execute('INSERT INTO students (user_id, name, roll_number, face_encoding) VALUES (?, ?, ?, ?)', 
                     (user_id, name, roll_number, encoding_str))
        conn.commit()
        return jsonify({'success': True, 'message': 'Student registered successfully'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Roll number already exists'}), 400
    finally:
        conn.close()

@app.route('/api/attendance/mark', methods=['POST'])
def mark_attendance():
    data = request.json
    face_image = data.get('face_image')
    session_id = data.get('session_id')
    
    if not face_image or not session_id:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
    conn = get_db_connection()
    try:
        students = conn.execute('SELECT id, face_encoding FROM students WHERE face_encoding IS NOT NULL').fetchall()
        known_encodings = {}
        for s in students:
            enc_list = json.loads(s['face_encoding'])
            known_encodings[s['id']] = enc_list
            
        if not known_encodings:
            return jsonify({'success': False, 'message': 'No registered students found'}), 400
            
        match_res = face_service.match_face(face_image, known_encodings)
        if not match_res['success']:
            return jsonify(match_res), 400
            
        student_id = match_res['student_id']
        
        from datetime import datetime
        date_str = datetime.now().strftime('%Y-%m-%d')
        
        existing = conn.execute('SELECT id FROM attendance WHERE student_id = ? AND session_id = ?', (student_id, session_id)).fetchone()
        if existing:
            return jsonify({'success': True, 'message': 'Attendance already marked'})
            
        conn.execute('INSERT INTO attendance (student_id, date, status, session_id) VALUES (?, ?, ?, ?)', 
                     (student_id, date_str, 'Present', session_id))
        conn.commit()
        return jsonify({'success': True, 'message': 'Attendance marked successfully', 'student_id': student_id})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    students = conn.execute('SELECT id, name, roll_number FROM students').fetchall()
    conn.close()
    return jsonify({'success': True, 'students': [dict(s) for s in students]})

@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    conn = get_db_connection()
    records = conn.execute('''
        SELECT a.id, a.date, a.status, a.session_id, s.name, s.roll_number 
        FROM attendance a 
        JOIN students s ON a.student_id = s.id 
        ORDER BY a.id DESC
    ''').fetchall()
    conn.close()
    return jsonify({'success': True, 'attendance': [dict(r) for r in records]})

@app.route('/api/admin/stats', methods=['GET'])
def get_stats():
    conn = get_db_connection()
    stats = {
        'total_users': 0,
        'total_students': 0,
        'attendance_records': 0
    }
    try:
        users = conn.execute('SELECT COUNT(*) as count FROM users').fetchone()
        stats['total_users'] = users['count'] if users else 0
        
        students = conn.execute('SELECT COUNT(*) as count FROM students').fetchone()
        stats['total_students'] = students['count'] if students else 0
        
        attendance = conn.execute('SELECT COUNT(*) as count FROM attendance').fetchone()
        stats['attendance_records'] = attendance['count'] if attendance else 0
        
        return jsonify({'success': True, 'stats': stats})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@app.route('/api/users/add', methods=['POST'])
def add_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    
    if not all([username, password, role]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
        
    if role not in ['admin', 'faculty', 'student']:
        return jsonify({'success': False, 'message': 'Invalid role'}), 400
        
    conn = get_db_connection()
    import sqlite3
    try:
        conn.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', (username, password, role))
        conn.commit()
        return jsonify({'success': True, 'message': f'{role.capitalize()} added successfully'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
