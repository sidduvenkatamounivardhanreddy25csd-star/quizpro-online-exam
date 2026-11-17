import sqlite3
import os
from werkzeug.security import generate_password_hash

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'quizpro.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.executescript('''
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('student', 'admin'))
    );

    CREATE TABLE IF NOT EXISTS Quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL DEFAULT 30,
        category TEXT DEFAULT 'Computer Science',
        pass_mark INTEGER DEFAULT 70,
        published INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS Questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        explanation TEXT,
        points INTEGER DEFAULT 2,
        FOREIGN KEY (quiz_id) REFERENCES Quizzes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        quiz_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        percentage REAL NOT NULL,
        time_spent_seconds INTEGER DEFAULT 0,
        answers_json TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES Quizzes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS QuizSessions (
        user_id INTEGER NOT NULL,
        quiz_id INTEGER NOT NULL,
        started_at INTEGER NOT NULL,
        PRIMARY KEY (user_id, quiz_id)
    );
    ''')

    # Check if Users exists
    cursor.execute('SELECT COUNT(*) as count FROM Users')
    count = cursor.fetchone()['count']
    if count == 0:
        seed_data(cursor)

    conn.commit()
    conn.close()

def seed_data(cursor):
    student_hash = generate_password_hash('alex123')
    admin_hash = generate_password_hash('admin123')
    student2_hash = generate_password_hash('student123')

    cursor.executemany('''
        INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)
    ''', [
        ('Alex Rivera', 'student@quizpro.edu', student_hash, 'student'),
        ('Dr. Eleanor Vance', 'admin@quizpro.edu', admin_hash, 'admin'),
        ('Marcus Chen', 'marcus@quizpro.edu', student2_hash, 'student'),
        ('Elena Rostova', 'elena@quizpro.edu', student2_hash, 'student'),
        ('David Kalu', 'david@quizpro.edu', student2_hash, 'student')
    ])

    cursor.executemany('''
        INSERT INTO Quizzes (id, title, description, duration, category, pass_mark, published)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', [
        (1, 'Python Advanced & Web Architecture', 'Core principles of modern Python, backend API routing, request lifecycles, and database ORM synchronization.', 45, 'Computer Science', 70, 1),
        (2, 'Computer Networks & Protocols', 'Routing algorithms, TCP/IP stack, DNS resolution, CIDR subnetting, and network security foundations.', 30, 'Computer Science', 65, 1),
        (3, 'Machine Learning Foundations', 'Supervised vs unsupervised learning, gradient descent, loss functions, backprop, and CNN architectures.', 45, 'AI & Data Science', 75, 1),
        (4, 'Discrete Mathematics & Graph Theory', 'Set theory, predicate logic, recurrence relations, Dijkstra algorithm, and combinatorial proofs.', 40, 'Core Theory', 70, 1),
        (5, 'Operating Systems Midterm Prep', 'Process scheduling, virtual memory paging, deadlock prevention, and page replacement algorithms.', 45, 'Computer Science', 70, 1),
        (6, 'Database Management Systems (DBMS)', 'Relational schemas, SQL queries, B-Tree indexing, ACID transactions, and normalization forms.', 35, 'Database Systems', 65, 1),
        (7, 'Discrete Math Quiz 1', 'Staged review questions on formal boolean logic and mathematical induction.', 30, 'Core Theory', 70, 0)
    ])

    cursor.executemany('''
        INSERT INTO Questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', [
        (1, 'Which HTTP status code is typically returned after successfully creating a resource via a POST request?', '200 OK', '201 Created', '204 No Content', '301 Moved Permanently', 'B', 'HTTP 201 indicates that the request has succeeded and led to the creation of a resource.', 2),
        (1, 'Which HTTP method is handled by default when defining a new endpoint with @app.route(\'/api\') in Flask?', 'POST', 'GET', 'PUT', 'DELETE', 'B', 'By default, Flask routes only listen to GET requests unless methods=[\'POST\', ...] is explicitly declared.', 2),
        (1, 'What is the output of the Python expression type((1,))?', '<class \'int\'>', '<class \'list\'>', '<class \'tuple\'>', '<class \'generator\'>', 'C', 'A single item followed by a comma enclosed in parentheses defines a 1-element tuple in Python.', 2),
        (1, 'Which operation on a standard Python built-in dictionary has an amortized average time complexity of O(1) and worst-case O(n)?', 'Key lookup or assignment with hash collisions', 'Iterating over all dictionary keys', 'Copying the entire dictionary with dict.copy()', 'Clearing all elements with dict.clear()', 'A', 'Hash table lookup is O(1) on average, but degrades to O(n) under worst-case hash collisions.', 2),
        (1, 'In Flask, what is the purpose of a Blueprint object?', 'To compile Jinja templates into bytecode', 'To organize application routes and modular components into reusable sub-applications', 'To automatically generate SQLite migrations', 'To run asynchronous worker queues', 'B', 'Blueprints provide modularity, allowing developers to group related routes, templates, and static files.', 2),
        (1, 'What is the primary difference between a Python generator and a regular list comprehension?', 'Generators evaluate lazily on-the-fly yielding values one by one without loading all items into memory', 'Generators are always immutable and cannot be iterated', 'List comprehensions can only contain numerical types', 'Generators run in a separate operating system thread', 'A', 'Generators use lazy evaluation, drastically reducing memory footprint for large datasets.', 2)
    ])

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully at:", DB_PATH)
