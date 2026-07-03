import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  response => response,
  error => {
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
  triggerDownload(new Blob([response.data]), filename);
}

async function downloadPdfById(url, filename) {
  const response = await api.get(url, { responseType: 'blob' });
  triggerDownload(new Blob([response.data]), filename);
}

export const motivationApi = {
  generate: (data) => api.post('/motivation/generate', data).then(r => r.data),
  downloadPdf: (data) => downloadPdf('/motivation/download-pdf', data, 'motivation-letter.pdf'),
};

export const recommendationApi = {
  generate: (data) => api.post('/recommendation/generate', data).then(r => r.data),
  downloadPdf: (data) => downloadPdf('/recommendation/download-pdf', data, 'recommendation-letter.pdf'),
};

export const historyApi = {
  getAll: (page = 1, limit = 20) => api.get('/history', { params: { page, limit } }).then(r => r.data),
  getById: (id) => api.get(`/history/${id}`).then(r => r.data),
  downloadPdf: (id) => downloadPdfById(`/history/${id}/pdf`, `letter-${id}.pdf`),
  delete: (id) => api.delete(`/history/${id}`).then(r => r.data),
};
