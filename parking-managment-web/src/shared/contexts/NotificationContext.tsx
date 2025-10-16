import { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
}

export interface NotificationState extends Notification {
  isVisible: boolean;
}

interface NotificationContextType {
  notification: NotificationState | null;
  showNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string, duration?: number, title?: string) => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string, duration: number = 3000, title?: string) => {
    setNotification({ type, message, title, isVisible: true });
    setTimeout(() => setNotification(null), duration);
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
