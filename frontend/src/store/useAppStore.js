import { create } from 'zustand';
import axios from 'axios';

const useAppStore = create((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),

  stats: { total: 0, motivation: 0, recommendation: 0 },
  setStats: (stats) => set({ stats }),

  generating: false,
  setGenerating: (generating) => set({ generating }),

  // Auth State
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  setAuth: (user, token) => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ user, token });
  },
  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      // Ignore logging out request failure
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));

export default useAppStore;
