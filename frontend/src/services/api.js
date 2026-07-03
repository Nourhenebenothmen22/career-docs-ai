import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
});

export const motivationApi = {
  generate: (data) => api.post('/motivation/generate', data).then(r => r.data),
  downloadPdf: async (data) => {
    const response = await api.post('/motivation/download-pdf', data, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'motivation-letter.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export const recommendationApi = {
  generate: (data) => api.post('/recommendation/generate', data).then(r => r.data),
  downloadPdf: async (data) => {
    const response = await api.post('/recommendation/download-pdf', data, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'recommendation-letter.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export const historyApi = {
  getAll: (page = 1, limit = 20) => api.get('/history', { params: { page, limit } }).then(r => r.data),
  getById: (id) => api.get(`/history/${id}`).then(r => r.data),
  downloadPdf: async (id) => {
    const response = await api.get(`/history/${id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `letter-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  delete: (id) => api.delete(`/history/${id}`).then(r => r.data),
};
