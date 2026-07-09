import { create } from 'zustand';
import { UIState, Notification } from '../types';

interface UIStateExtended extends UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStateExtended>((set) => ({
  modals: {},
  sidebarOpen: true,
  notifications: [],

  openModal: (name: string) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [name]: true,
      },
    }));
  },

  closeModal: (name: string) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [name]: false,
      },
    }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  toggleSidebar: () => {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    }));
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // Auto-remove notification after duration
    if (notification.duration !== null) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== notification.id),
        }));
      }, notification.duration || 3000);
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
