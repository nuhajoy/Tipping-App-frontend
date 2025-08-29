'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotificationStore } from '@/lib/store';
import { formatCurrency } from '@/lib/currency';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Gift, Settings, TrendingUp, CheckCheck } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Gift className="w-5 h-5 text-[#71FF71]" />;
      case 'system': return <Settings className="w-5 h-5 text-blue-500" />;
      case 'promotion': return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Notifications
            </DialogTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-sm hover:bg-[#71FF71]/10"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                    notification.read
                      ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      : 'bg-[#71FF71]/5 border-[#71FF71]/30 hover:bg-[#71FF71]/10'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge className="bg-[#71FF71] text-gray-900 text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {notification.message}
                      </p>
                      {notification.amount && (
                        <p className="text-sm font-semibold text-[#71FF71]">
                          {formatCurrency(notification.amount)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}