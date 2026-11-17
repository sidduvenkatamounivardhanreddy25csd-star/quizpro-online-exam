import { User, Quiz, Question, AdminQuestion, AttemptResult, AttemptHistoryItem, StudentDashboardData, AdminOverviewData } from '../types/quiz';

const TOKEN_KEY = 'quizpro_auth_token';
const USER_KEY = 'quizpro_auth_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || 'token_student_alex';
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return {
      id: 1,
      name: 'Alex Rivera',
      email: 'student@quizpro.edu',
      role: 'student'
    };
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAuth(user: User, token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `Request failed: ${res.statusText}`;
    try {
      const data = await res.json();
      if (data.error) errorMsg = data.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const data = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredAuth(data.user, data.token);
    return data;
  },

  async register(name: string, email: string, password: string, role: 'student' | 'admin'): Promise<{ user: User; token: string }> {
    const data = await request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    setStoredAuth(data.user, data.token);
    return data;
  },

  async switchDemo(role: 'student' | 'admin'): Promise<{ user: User; token: string }> {
    const data = await request<{ user: User; token: string }>('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    setStoredAuth(data.user, data.token);
    return data;
  },

  async getMe(): Promise<{ user: User; token: string }> {
    return request('/api/auth/me');
  },

  // Quizzes
  async getQuizzes(): Promise<Quiz[]> {
    return request('/api/quizzes');
  },

  async getAdminQuizzes(): Promise<Quiz[]> {
    return request('/api/quizzes?admin=true');
  },

  async getQuiz(id: number): Promise<Quiz & { questions: Question[] }> {
    return request(`/api/quizzes/${id}`);
  },

  async getQuizAdmin(id: number): Promise<Quiz & { questions: AdminQuestion[] }> {
    return request(`/api/quizzes/${id}/admin`);
  },

  async createQuiz(data: any): Promise<{ id: number; message: string }> {
    return request('/api/quizzes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateQuiz(id: number, data: any): Promise<{ message: string }> {
    return request(`/api/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteQuiz(id: number): Promise<{ message: string }> {
    return request(`/api/quizzes/${id}`, {
      method: 'DELETE',
    });
  },

  async togglePublish(id: number): Promise<{ published: number }> {
    return request(`/api/quizzes/${id}/publish`, {
      method: 'POST',
    });
  },

  // Taking Quiz
  async startQuiz(id: number): Promise<{ message: string; duration: number }> {
    return request(`/api/quizzes/${id}/start`, {
      method: 'POST',
    });
  },

  async submitQuiz(id: number, answers: Record<number, string>, timeSpentSeconds: number): Promise<AttemptResult> {
    return request(`/api/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, time_spent_seconds: timeSpentSeconds }),
    });
  },

  // Attempts & Results
  async getMyAttempts(): Promise<AttemptHistoryItem[]> {
    return request('/api/attempts/my');
  },

  async getAttempt(id: number): Promise<AttemptResult> {
    return request(`/api/attempts/${id}`);
  },

  // Dashboards
  async getStudentDashboard(): Promise<StudentDashboardData> {
    return request('/api/student/dashboard');
  },

  async getAdminOverview(): Promise<AdminOverviewData> {
    return request('/api/admin/overview');
  },

  async getAdminReports(): Promise<any[]> {
    return request('/api/admin/reports');
  }
};
