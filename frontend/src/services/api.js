const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {};

  // Don't set Content-Type for FormData — browser sets it with boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  signup: (data) => request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getMe: () => request('/api/auth/me'),

  // Interviews
  startSession: (data) => request('/api/interview/start', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  sendAnswer: (data) => request('/api/interview/chat', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  endInterview: (data) => request('/api/interview/end', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getInterviewHistory: () => request('/api/interview/history'),

  // Resume
  uploadResume: (sessionId, file) => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('file', file);
    return request('/api/resume/upload', {
      method: 'POST',
      body: formData,
    });
  },
};
