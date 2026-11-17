import json
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from database import get_db_connection, init_db

app = Flask(__name__)
CORS(app)

# Initialize SQLite database on startup
init_db()

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'student')
    if role not in ['student', 'admin']:
        role = 'student'

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT id FROM Users WHERE email = ?', (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Email is already registered'}), 400

    password_hash = generate_password_hash(password)
    cursor.execute(
        'INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        (name, email, password_hash, role)
    )
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()

    token = f"token_{user_id}"
    return jsonify({
        'user': {'id': user_id, 'name': name, 'email': email, 'role': role},
        'token': token
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM Users WHERE email = ?', (email,))
    user = cursor.fetchone()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = f"token_{user['id']}"
    return jsonify({
        'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'role': user['role']},
        'token': token
    })

@app.route('/api/quizzes', methods=['GET'])
def get_quizzes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT q.*, 
            (SELECT COUNT(*) FROM Questions WHERE quiz_id = q.id) as question_count,
            (SELECT COUNT(*) FROM Attempts WHERE quiz_id = q.id) as attempt_count,
            (SELECT ROUND(AVG(percentage), 1) FROM Attempts WHERE quiz_id = q.id) as avg_score
        FROM Quizzes q
        ORDER BY q.id ASC
    ''')
    quizzes = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(quizzes)

@app.route('/api/quizzes/<int:quiz_id>', methods=['GET'])
def get_quiz_student(quiz_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM Quizzes WHERE id = ?', (quiz_id,))
    quiz = cursor.fetchone()
    if not quiz:
        conn.close()
        return jsonify({'error': 'Quiz not found'}), 404

    # Security: do NOT expose correct_answer or explanation to student
    cursor.execute('''
        SELECT id, quiz_id, question, option_a, option_b, option_c, option_d, points
        FROM Questions
        WHERE quiz_id = ?
        ORDER BY id ASC
    ''', (quiz_id,))
    questions = [dict(row) for row in cursor.fetchall()]
    conn.close()

    res = dict(quiz)
    res['questions'] = questions
    return jsonify(res)

@app.route('/api/quizzes/<int:quiz_id>/submit', methods=['POST'])
def submit_quiz(quiz_id):
    data = request.get_json() or {}
    answers = data.get('answers', {})
    time_spent = data.get('time_spent_seconds', 0)
    user_id = data.get('user_id', 1)

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM Quizzes WHERE id = ?', (quiz_id,))
    quiz = cursor.fetchone()
    if not quiz:
        conn.close()
        return jsonify({'error': 'Quiz not found'}), 404

    cursor.execute('SELECT * FROM Questions WHERE quiz_id = ? ORDER BY id ASC', (quiz_id,))
    questions = cursor.fetchall()

    earned_score = 0
    total_score = 0
    correct_count = 0
    review = []

    for q in questions:
        points = q['points'] or 2
        total_score += points
        student_ans = str(answers.get(str(q['id']), '')).strip().upper()
        correct_ans = str(q['correct_answer']).strip().upper()
        is_correct = (student_ans == correct_ans)

        if is_correct:
            earned_score += points
            correct_count += 1

        review.append({
            'id': q['id'],
            'question': q['question'],
            'studentAnswer': student_ans,
            'correctAnswer': correct_ans,
            'isCorrect': is_correct,
            'explanation': q['explanation'] or ''
        })

    percentage = round((earned_score / total_score * 100), 1) if total_score > 0 else 0
    cursor.execute('''
        INSERT INTO Attempts (user_id, quiz_id, score, total, percentage, time_spent_seconds, answers_json, submitted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ''', (user_id, quiz_id, earned_score, total_score, percentage, time_spent, json.dumps(answers)))
    attempt_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        'attemptId': attempt_id,
        'quizId': quiz_id,
        'quizTitle': quiz['title'],
        'score': earned_score,
        'total': total_score,
        'correctCount': correct_count,
        'totalQuestions': len(questions),
        'percentage': percentage,
        'passed': percentage >= quiz['pass_mark'],
        'review': review
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
