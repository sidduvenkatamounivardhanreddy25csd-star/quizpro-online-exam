import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.resolve(process.cwd(), 'quizpro.db');

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'student' | 'admin';
}

export interface QuizRow {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  category: string;
  pass_mark: number; // percentage, e.g. 70
  published: number; // 0: draft, 1: published, 2: archived
}

export interface QuestionRow {
  id: number;
  quiz_id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string; // 'A' | 'B' | 'C' | 'D'
  explanation: string;
  points: number;
}

export interface AttemptRow {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  total: number;
  percentage: number;
  time_spent_seconds: number;
  answers_json: string;
  submitted_at: string;
}

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  initTables(dbInstance);
  seedInitialData(dbInstance);
  saveDb(dbInstance);

  return dbInstance;
}

export function saveDb(db: Database) {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('Error saving SQLite DB to disk:', err);
  }
}

function initTables(db: Database) {
  db.run(`
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
      correct_count INTEGER DEFAULT 0,
      total_questions INTEGER DEFAULT 0,
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
  `);

  // Migrations for existing database
  try {
    db.run("ALTER TABLE Attempts ADD COLUMN correct_count INTEGER DEFAULT 0;");
  } catch (_) {}
  try {
    db.run("ALTER TABLE Attempts ADD COLUMN total_questions INTEGER DEFAULT 0;");
  } catch (_) {}
}

function seedInitialData(db: Database) {
  // Check if users exist
  const userCheck = db.exec("SELECT count(*) as count FROM Users");
  const count = userCheck.length > 0 && userCheck[0].values.length > 0 ? (userCheck[0].values[0][0] as number) : 0;
  if (count > 0) {
    return; // Already seeded
  }

  console.log('Seeding initial QuizPro database with users, quizzes, and questions...');

  const studentHash = bcrypt.hashSync('alex123', 10);
  const adminHash = bcrypt.hashSync('admin123', 10);
  const student2Hash = bcrypt.hashSync('student123', 10);

  // Users: Alex Rivera (Student), Dr. Eleanor Vance (Admin), Marcus Chen (Student), Elena Rostova (Student), David Kalu (Student)
  db.run(`INSERT INTO Users (name, email, password_hash, role) VALUES 
    ('Alex Rivera', 'student@quizpro.edu', '${studentHash}', 'student'),
    ('Dr. Eleanor Vance', 'admin@quizpro.edu', '${adminHash}', 'admin'),
    ('Marcus Chen', 'marcus@quizpro.edu', '${student2Hash}', 'student'),
    ('Elena Rostova', 'elena@quizpro.edu', '${student2Hash}', 'student'),
    ('David Kalu', 'david@quizpro.edu', '${student2Hash}', 'student');
  `);

  // Quizzes matching the designs
  db.run(`INSERT INTO Quizzes (id, title, description, duration, category, pass_mark, published) VALUES
    (1, 'Python Advanced & Web Architecture', 'Core principles of modern Python, backend API routing, request lifecycles, and database ORM synchronization.', 45, 'Computer Science', 70, 1),
    (2, 'Computer Networks & Protocols', 'Routing algorithms, TCP/IP stack, DNS resolution, CIDR subnetting, and network security foundations.', 30, 'Computer Science', 65, 1),
    (3, 'Machine Learning Foundations', 'Supervised vs unsupervised learning, gradient descent, loss functions, backprop, and CNN architectures.', 45, 'AI & Data Science', 75, 1),
    (4, 'Discrete Mathematics & Graph Theory', 'Set theory, predicate logic, recurrence relations, Dijkstra algorithm, and combinatorial proofs.', 40, 'Core Theory', 70, 1),
    (5, 'Operating Systems Midterm Prep', 'Process scheduling, virtual memory paging, deadlock prevention, and page replacement algorithms.', 45, 'Computer Science', 70, 1),
    (6, 'Database Management Systems (DBMS)', 'Relational schemas, SQL queries, B-Tree indexing, ACID transactions, and normalization forms.', 35, 'Database Systems', 65, 1),
    (7, 'Discrete Math Quiz 1', 'Staged review questions on formal boolean logic and mathematical induction.', 30, 'Core Theory', 70, 0);
  `);

  // Questions for Quiz 1: Python Advanced & Web Architecture
  db.run(`INSERT INTO Questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, points) VALUES
    (1, 'Which HTTP status code is typically returned after successfully creating a resource via a POST request?', '200 OK', '201 Created', '204 No Content', '301 Moved Permanently', 'B', 'HTTP 201 indicates that the request has succeeded and led to the creation of a resource, usually with a Location header.', 2),
    (1, 'Which HTTP method is handled by default when defining a new endpoint with @app.route(\''/api\'') in Flask?', 'POST', 'GET', 'PUT', 'DELETE', 'B', 'By default, Flask routes only listen to GET requests unless methods=[\''POST\'', ...] is explicitly declared.', 2),
    (1, 'What is the output of the Python expression type((1,))?', '<class \''int\''>', '<class \''list\''>', '<class \''tuple\''>', '<class \''generator\''>', 'C', 'A single item followed by a comma enclosed in parentheses defines a 1-element tuple in Python.', 2),
    (1, 'Which operation on a standard Python built-in dictionary has an amortized average time complexity of O(1) and worst-case O(n)?', 'Key lookup or assignment with hash collisions', 'Iterating over all dictionary keys', 'Copying the entire dictionary with dict.copy()', 'Clearing all elements with dict.clear()', 'A', 'Hash table lookup is O(1) on average, but degrades to O(n) under worst-case hash collisions.', 2),
    (1, 'In Flask, what is the purpose of a Blueprint object?', 'To compile Jinja templates into bytecode', 'To organize application routes and modular components into reusable sub-applications', 'To automatically generate SQLite migrations', 'To run asynchronous worker queues', 'B', 'Blueprints provide modularity, allowing developers to group related routes, templates, and static files.', 2),
    (1, 'What is the primary difference between a Python generator and a regular list comprehension?', 'Generators evaluate lazily on-the-fly yielding values one by one without loading all items into memory', 'Generators are always immutable and cannot be iterated', 'List comprehensions can only contain numerical types', 'Generators run in a separate operating system thread', 'A', 'Generators use lazy evaluation, drastically reducing memory footprint for large datasets.', 2);
  `);

  // Questions for Quiz 2: Computer Networks & Protocols
  db.run(`INSERT INTO Questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, points) VALUES
    (2, 'At which layer of the OSI model does the Internet Protocol (IP) operate?', 'Transport Layer (Layer 4)', 'Network Layer (Layer 3)', 'Data Link Layer (Layer 2)', 'Session Layer (Layer 5)', 'B', 'The Network Layer (Layer 3) handles logical packet addressing, routing, and path determination.', 2),
    (2, 'What mechanism does TCP use to establish a reliable full-duplex communication channel before data transmission?', 'Two-way Handshake', 'Three-way Handshake (SYN, SYN-ACK, ACK)', 'Sliding Window Protocol', 'DHCP Lease Negotiation', 'B', 'TCP utilizes the standard SYN, SYN-ACK, and ACK 3-way handshake to synchronize sequence numbers.', 2),
    (2, 'What is the primary function of the Address Resolution Protocol (ARP)?', 'Map a known domain name to an IP address', 'Map an IP address to a physical MAC address on a local link', 'Encrypt payload data at the application boundary', 'Throttle congestion across WAN gateways', 'B', 'ARP translates a logical IPv4 address to its corresponding physical MAC address in local networks.', 2),
    (2, 'In CIDR notation, how many usable host IP addresses are available in a subnet with a /28 mask?', '14 usable hosts', '16 usable hosts', '30 usable hosts', '12 usable hosts', 'A', 'A /28 subnet provides 2^(32-28) = 16 total IPs. Subtracting network ID and broadcast yields 14 usable hosts.', 2);
  `);

  // Questions for Quiz 3: Machine Learning Foundations
  db.run(`INSERT INTO Questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, points) VALUES
    (3, 'Which activation function is most commonly used in intermediate hidden layers of modern Convolutional Neural Networks?', 'Sigmoid', 'Hyperbolic Tangent (Tanh)', 'Rectified Linear Unit (ReLU)', 'Softmax', 'C', 'ReLU (max(0, x)) overcomes vanishing gradient problems and is computationally efficient.', 2),
    (3, 'What does the term "Overfitting" signify in supervised machine learning models?', 'The model performs poorly on training data and test data', 'The model learns noise and specific training examples, failing to generalize to unseen test data', 'The model has too few parameters to capture linear relationships', 'The learning rate is tuned too high during gradient descent', 'B', 'Overfitting happens when excessive model capacity memorizes training noise instead of general patterns.', 2),
    (3, 'Which loss function is optimal for multi-class classification where outputs are normalized via Softmax?', 'Mean Squared Error (MSE)', 'Categorical Cross-Entropy', 'Binary Cross-Entropy', 'Huber Loss', 'B', 'Categorical Cross-Entropy penalizes divergences between predicted probability distributions and true one-hot labels.', 2);
  `);

  // Questions for Quiz 4: Discrete Mathematics
  db.run(`INSERT INTO Questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, points) VALUES
    (4, 'What is the contrapositive of the conditional statement "If P then Q"?', 'If not P then not Q', 'If Q then P', 'If not Q then not P', 'P and not Q', 'C', 'The contrapositive of "P -> Q" is "~Q -> ~P", which is logically equivalent to the original statement.', 2),
    (4, 'In an undirected simple graph with 6 vertices, what is the maximum possible number of edges?', '15 edges', '30 edges', '12 edges', '18 edges', 'A', 'The maximum edges in a simple graph with n vertices is n*(n-1)/2 = 6*5/2 = 15 edges.', 2),
    (4, 'What does Dijkstra''s algorithm compute on a weighted directed graph with non-negative edge weights?', 'The minimum spanning tree', 'The shortest path from a single source vertex to all other vertices', 'All-pairs shortest paths using matrix multiplication', 'The strongly connected components', 'B', 'Dijkstra solves the single-source shortest path problem efficiently using a priority queue.', 2);
  `);

  // Questions for Quiz 5: Operating Systems Midterm Prep
  db.run(`INSERT INTO Questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, points) VALUES
    (5, 'What is the primary condition that causes Belady''s Anomaly in page replacement algorithms?', 'Increasing the number of page frames leads to more page faults under FIFO', 'A process requests non-contiguous virtual memory blocks', 'CPU utilization drops below 10% during thrashing', 'LRU eviction fails to inspect the dirty bit', 'A', 'Belady''s Anomaly is a counter-intuitive phenomenon where increasing page frames results in more page faults (seen in FIFO).', 2),
    (5, 'Which of the following is NOT one of Coffman''s four necessary conditions for deadlock?', 'Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait', 'C', 'No Preemption is required for deadlock; if preemption is allowed, deadlock cannot occur.', 2),
    (5, 'What is the role of the Translation Lookaside Buffer (TLB) in virtual memory management?', 'To cache recently translated virtual-to-physical address mappings in fast hardware', 'To store dirty pages before flushing to swap disk', 'To arbitrate DMA bus access between storage controllers', 'To encrypt kernel space memory pages', 'A', 'TLB is a high-speed associative hardware cache that speeds up virtual-to-physical address translation.', 2);
  `);

  // Questions for Quiz 6: Database Management Systems (DBMS)
  db.run(`INSERT INTO Questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, points) VALUES
    (6, 'What does the "I" in ACID database transactions stand for?', 'Integrity', 'Isolation', 'Indexability', 'Immutability', 'B', 'Isolation ensures that concurrent transactions execute without interfering with one another.', 2),
    (6, 'Which normal form requires that a relation is in 2NF and has no transitive functional dependencies?', 'First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)', 'C', '3NF requires that non-key attributes depend only on the primary key and not on any other non-key attribute.', 2);
  `);

  // Seed sample past attempts for Alex Rivera (User ID 1) and other students
  db.run(`INSERT INTO Attempts (user_id, quiz_id, score, total, percentage, correct_count, total_questions, time_spent_seconds, answers_json, submitted_at) VALUES
    (1, 1, 10, 12, 83.3, 5, 6, 1122, '{"1":"B","2":"B","3":"C","4":"A","5":"B","6":"B"}', datetime('now', '-2 hours')),
    (1, 6, 4, 4, 100.0, 2, 2, 540, '{"17":"B","18":"C"}', datetime('now', '-1 day')),
    (1, 5, 4, 6, 66.7, 2, 3, 1230, '{"14":"A","15":"A","16":"A"}', datetime('now', '-3 days')),
    (3, 1, 12, 12, 100.0, 6, 6, 1440, '{"1":"B","2":"B","3":"C","4":"A","5":"B","6":"A"}', datetime('now', '-2 minutes')),
    (4, 5, 6, 6, 100.0, 3, 3, 1180, '{"14":"A","15":"C","16":"A"}', datetime('now', '-7 minutes')),
    (5, 2, 6, 8, 75.0, 3, 4, 920, '{"7":"B","8":"B","9":"B","10":"B"}', datetime('now', '-14 minutes'));
  `);
}

// Helper to convert sql.js exec result into array of JS objects
export function queryAll<T = any>(db: Database, sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params);
  }
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

export function queryOne<T = any>(db: Database, sql: string, params: any[] = []): T | null {
  const items = queryAll<T>(db, sql, params);
  return items.length > 0 ? items[0] : null;
}

export function execute(db: Database, sql: string, params: any[] = []): { lastInsertRowid: number; changes: number } {
  db.run(sql, params);
  const idRes = db.exec("SELECT last_insert_rowid() as id, changes() as changes");
  const lastInsertRowid = idRes.length > 0 && idRes[0].values.length > 0 ? (idRes[0].values[0][0] as number) : 0;
  const changes = idRes.length > 0 && idRes[0].values.length > 0 ? (idRes[0].values[0][1] as number) : 0;
  saveDb(db);
  return { lastInsertRowid, changes };
}
