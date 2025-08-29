'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthStore, useThemeStore, useNotificationStore } from '@/lib/store';
import { Bell, LogOut, Moon, QrCode, Share2, Sun, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  onQRCodeClick: () => void;
  onNotificationsClick: () => void;
}

export function DashboardHeader({ onQRCodeClick, onNotificationsClick }: DashboardHeaderProps) {
  const { employee, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#71FF71] flex items-center justify-center">
            <span className="text-gray-900 font-bold text-lg">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">TipTop</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Employee Dashboard</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onQRCodeClick}
            className="relative h-10 w-10 hover:bg-[#71FF71]/10"
          >
            <QrCode className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationsClick}
            className="relative h-10 w-10 hover:bg-[#71FF71]/10"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10 hover:bg-[#71FF71]/10"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#71FF71] text-gray-900 font-semibold">
                    {employee?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">{employee?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {employee?.businessName}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}