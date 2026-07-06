import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Detect unauthorized / expired access token status
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/auth/refresh' || originalRequest.url === '/auth/login') {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const accessToken = refreshResponse.data?.data?.accessToken;

        if (!accessToken) throw new Error('Refresh response missing token');

        localStorage.setItem('token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Redirect to login if not already there
        if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    const message = error.response?.data?.message || error.message || 'Network error';
    const formatted = new Error(message);
    formatted.status = error.response?.status;
    formatted.data = error.response?.data;
    return Promise.reject(formatted);
  }
);

function triggerDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

async function downloadPdf(url, data, filename) {
  const response = await api.post(url, data, { responseType: 'blob' });
  triggerDownload(response.data, filename);
}

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }).then(r => r.data),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }).then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data),
};

export const motivationApi = {
  generate: (data) => api.post('/motivation/generate', data).then(r => r.data),
  downloadPdf: (data) => downloadPdf('/motivation/download-pdf', data, 'motivation-letter.pdf'),
};

export const recommendationApi = {
  generate: (data) => api.post('/recommendation/generate', data).then(r => r.data),
  downloadPdf: (data) => downloadPdf('/recommendation/download-pdf', data, 'recommendation-letter.pdf'),
};
