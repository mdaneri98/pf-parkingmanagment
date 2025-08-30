import { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  type: 'success' | 'error';
  message: string;
}

interface NotificationContextType {
  notification: Notification | null;
  showNotification: (type: 'success' | 'error', message: string, duration?: number) => void;
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
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (type: 'success' | 'error', message: string, duration: number = 3000) => {
    setNotification({ type, message });
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
