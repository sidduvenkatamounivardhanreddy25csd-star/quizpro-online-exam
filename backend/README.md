# QuizPro Python Flask Backend & SQLite Database

This directory contains the Python Flask backend for the **QuizPro - Online Quiz and Result Management System**.

## Database Schema (SQLite)
The application connects to `quizpro.db` with the following 4 core relational tables:
- **`Users`**: `id`, `name`, `email`, `password_hash`, `role` (`student` or `admin`)
- **`Quizzes`**: `id`, `title`, `description`, `duration`, `category`, `pass_mark`, `published`
- **`Questions`**: `id`, `quiz_id`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `points`
- **`Attempts`**: `id`, `user_id`, `quiz_id`, `score`, `total`, `percentage`, `time_spent_seconds`, `answers_json`, `submitted_at`

## How to Run Locally

### 1. Prerequisites
- Python 3.8+ installed (`python3 --version`)

### 2. Create and Activate Virtual Environment
```bash
cd backend
python3 -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Initialize Database & Seed Sample Quizzes
The database and sample data auto-initialize on the first run of the app, or you can manually initialize:
```bash
python database.py
```

### 5. Run the Flask Server
```bash
python app.py
```
The server will start listening at `http://127.0.0.1:5000/`.

## Pre-seeded Test Accounts
- **Student**: `student@quizpro.edu` / `alex123`
- **Admin**: `admin@quizpro.edu` / `admin123`
