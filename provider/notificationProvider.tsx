"use client"
import { generateFakeNotifications } from '@/public/assets/data';
import React, { createContext, useContext, useState, useCallback } from 'react';

export type Notification = {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: Date;
  read: boolean;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: number) => void;
  clearAllNotifications: () => void;
  markAsRead: (id: number) => void;
  filterNotifications: (options: {
    startDate?: Date;
    endDate?: Date;
    readStatus?: 'read' | 'unread' | 'all';
  }) => Notification[];
  notificationCount: number;
  showNotificationComponent: boolean;
  toggleNotificationComponent: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationComponent, setShowNotificationComponent] = useState<boolean>(false);
  const addNotification = useCallback((message: string, type: Notification['type']) => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), message, type, createdAt: new Date(), read: false }
    ]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  React.useEffect(() => {
    const fakeNotifications = generateFakeNotifications();
    setNotifications(fakeNotifications);
  }, []);

  const filterNotifications = useCallback(
    (options: { startDate?: Date; endDate?: Date; readStatus?: 'read' | 'unread' | 'all' }) => {
      return notifications.filter((notification) => {
        const dateInRange =
          (!options.startDate || notification.createdAt >= options.startDate) &&
          (!options.endDate || notification.createdAt <= options.endDate);

        const matchesReadStatus =
          options.readStatus === 'all' ||
          (options.readStatus === 'read' && notification.read) ||
          (options.readStatus === 'unread' && !notification.read);

        return dateInRange && matchesReadStatus;
      });
    },
    [notifications]
  );

  const notificationCount = React.useMemo(() => notifications.filter(notification => !notification.read).length, [notifications]);
  
  const toggleNotificationComponent = () => {
    setShowNotificationComponent(prev => !prev);
  };
  
  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    markAsRead,
    filterNotifications,
    notificationCount,
    showNotificationComponent,
    toggleNotificationComponent,
  };

  return (
    <NotificationContext.Provider
      value={contextValue}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationManager = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationManager must be used within a NotificationProvider');
  }
  return context;
};