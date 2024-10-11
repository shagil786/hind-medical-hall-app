"use client"
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Bell, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotificationManager } from '@/provider/notificationProvider';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSafeArea } from '@/provider/safeAreaProvider';
import InfiniteScroll from 'react-infinite-scroll-component';

type FilterType = 'all' | 'info' | 'success' | 'warning' | 'error';

const NotificationIcon = ({ type }: { type: FilterType }) => {
  switch (type) {
    case 'info': return <Info className="h-4 w-4 text-blue-500" />;
    case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
    default: return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export const NotificationDisplay: React.FC = () => {
    const { notifications, removeNotification, markAsRead, clearAllNotifications, showNotificationComponent, toggleNotificationComponent } = useNotificationManager();
    const [filter, setFilter] = useState<FilterType>('all');
    const { safeAreaClasses } = useSafeArea();
    const [displayedNotifications, setDisplayedNotifications] = useState<typeof notifications>([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const filteredNotifications = notifications.filter(
            notification => filter === 'all' || notification.type === filter
        );
        setDisplayedNotifications(filteredNotifications.slice(0, 10));
        setHasMore(filteredNotifications.length > 10);
    }, [filter, notifications]);

    const fetchMoreData = () => {
        const filteredNotifications = notifications.filter(
            notification => filter === 'all' || notification.type === filter
        );
        const currentLength = displayedNotifications.length;
        const newNotifications = filteredNotifications.slice(currentLength, currentLength + 10);
        setDisplayedNotifications([...displayedNotifications, ...newNotifications]);
        setHasMore(currentLength + newNotifications.length < filteredNotifications.length);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!showNotificationComponent) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-white dark:bg-gray-800 z-50 overflow-hidden"
            >
                <div className={`h-full flex flex-col ${safeAreaClasses} pad-top pad-bottom bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800`}>
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-2xl font-bold flex items-center">
                            Notifications
                            {unreadCount > 0 && (
                                <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>
                            )}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={toggleNotificationComponent}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    
                    <Tabs defaultValue="all" className="flex-grow flex flex-col">
                        <TabsList className="grid w-full grid-cols-5 p-2">
                            {(['all', 'info', 'success', 'warning', 'error'] as const).map((type) => (
                                <TabsTrigger key={type} value={type} onClick={() => setFilter(type)}>
                                    <NotificationIcon type={type} />
                                    <span className="ml-2 capitalize hidden sm:inline">{type}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value={filter} className="flex-grow overflow-hidden">
                            <InfiniteScroll
                                dataLength={displayedNotifications.length}
                                next={fetchMoreData}
                                hasMore={hasMore}
                                loader={<h4>Loading...</h4>}
                                scrollableTarget="scrollableDiv"
                                className=''
                            >
                                <div id="scrollableDiv" className="h-[calc(100vh-12rem)] overflow-y-auto px-4">
                                    {displayedNotifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className={`mb-4 p-4 rounded-md shadow-md relative ${
                                                notification.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-600'
                                            }`}
                                        >
                                            <div className="flex items-start">
                                                <NotificationIcon type={notification.type as FilterType} />
                                                <div className="ml-3 flex-1">
                                                    <p className="text-sm font-medium">{notification.message}</p>
                                                    <div className="mt-2 flex justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeNotification(notification.id)}
                                                        >
                                                            Dismiss
                                                        </Button>
                                                        {!notification.read && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => markAsRead(notification.id)}
                                                            >
                                                                Mark as read
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </InfiniteScroll>
                        </TabsContent>
                    </Tabs>
                    
                    {notifications.length > 0 && (
                        <div className="p-4 border-t">
                            <Button
                                className="w-full"
                                variant="destructive"
                                onClick={clearAllNotifications}
                            >
                                Clear All
                            </Button>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};