import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Toast notifications
  toasts: [],
  addToast: (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, duration);
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  // Document stats
  stats: { total: 0, motivation: 0, recommendation: 0 },
  setStats: (stats) => set({ stats }),

  // Generation loading state
  generating: false,
  setGenerating: (val) => set({ generating: val }),
}));

export default useAppStore;
