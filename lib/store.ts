import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Employee {
  id: string;
  name: string;
  email: string;
  uniqueCode: string;
  businessName: string;
  profileImage?: string;
}

export interface Tip {
  id: string;
  amount: number;
  currency: string;
  customerName?: string;
  message?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'tip' | 'system' | 'promotion';
  timestamp: Date;
  read: boolean;
  amount?: number;
}

interface AuthState {
  employee: Employee | null;
  isAuthenticated: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
}

interface TipsState {
  tips: Tip[];
  totalEarnings: number;
  todayEarnings: number;
  fetchTips: () => Promise<void>;
  addTip: (tip: Tip) => void;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      employee: null,
      isAuthenticated: false,
      login: async (code: string) => {
        try {
          // Simulate API call - replace with actual backend integration
          const mockEmployee: Employee = {
            id: '1',
            name: 'Meron Tadesse',
            email: 'meron.tadesse@example.com',
            uniqueCode: code,
            businessName: 'Addis Coffee House',
          };
          
          if (code.length >= 6) {
            set({ employee: mockEmployee, isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      logout: () => set({ employee: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useTipsStore = create<TipsState>((set, get) => ({
  tips: [],
  totalEarnings: 0,
  todayEarnings: 0,
  fetchTips: async () => {
    try {
      // Mock data - replace with actual API call
      const mockTips: Tip[] = [
        {
          id: '1',
          amount: 50,
          currency: 'ETB',
          customerName: 'Hanan Bekele',
          message: 'Excellent service!',
          timestamp: new Date(),
          status: 'completed'
        },
        {
          id: '2',
          amount: 25,
          currency: 'ETB',
          customerName: 'Dawit Alemayehu',
          message: 'Thank you!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'completed'
        },
        {
          id: '3',
          amount: 75,
          currency: 'ETB',
          customerName: 'Selamawit Girma',
          message: 'Great work!',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          status: 'completed'
        }
      ];
      
      const today = new Date().toDateString();
      const todayTips = mockTips.filter(tip => tip.timestamp.toDateString() === today);
      const totalToday = todayTips.reduce((sum, tip) => sum + tip.amount, 0);
      const total = mockTips.reduce((sum, tip) => sum + tip.amount, 0);
      
      set({ 
        tips: mockTips, 
        totalEarnings: total,
        todayEarnings: totalToday
      });
    } catch (error) {
      console.error('Failed to fetch tips:', error);
    }
  },
  addTip: (tip: Tip) => {
    const state = get();
    const newTips = [tip, ...state.tips];
    const total = newTips.reduce((sum, t) => sum + t.amount, 0);
    const today = new Date().toDateString();
    const todayTips = newTips.filter(t => t.timestamp.toDateString() === today);
    const totalToday = todayTips.reduce((sum, t) => sum + t.amount, 0);
    
    set({ 
      tips: newTips, 
      totalEarnings: total,
      todayEarnings: totalToday
    });
  },
}));

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: '1',
      title: 'New Tip Received!',
      message: 'You received 50 ETB from Hanan Bekele.',
      type: 'tip',
      timestamp: new Date(),
      read: false,
      amount: 50
    },
    {
      id: '2',
      title: 'Welcome to TipTop!',
      message: 'Your account has been successfully set up.',
      type: 'system',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true
    }
  ],
  unreadCount: 1,
  addNotification: (notification: Notification) => {
    const state = get();
    const newNotifications = [notification, ...state.notifications];
    const unread = newNotifications.filter(n => !n.read).length;
    set({ 
      notifications: newNotifications, 
      unreadCount: unread 
    });
  },
  markAsRead: (id: string) => {
    const state = get();
    const updated = state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    const unread = updated.filter(n => !n.read).length;
    set({ 
      notifications: updated, 
      unreadCount: unread 
    });
  },
  markAllAsRead: () => {
    const state = get();
    const updated = state.notifications.map(n => ({ ...n, read: true }));
    set({ 
      notifications: updated, 
      unreadCount: 0 
    });
  },
}));

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      setTheme: (theme: 'light' | 'dark') => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);