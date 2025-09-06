'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from './dashboard-header';
import { StatsCards } from './stats-cards';
import { TipHistory } from './tip-history';
import { QRCodeModal } from './qr-code-modal';
import { NotificationsModal } from './notifications-modal';
import { useTipsStore } from '@/lib/store';

export function EmployeeDashboard() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const { fetchTips } = useTipsStore();

  useEffect(() => {
    fetchTips();
  }, [fetchTips]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardHeader
        onQRCodeClick={() => setIsQRModalOpen(true)}
        onNotificationsClick={() => setIsNotificationsModalOpen(true)}
      />
      
      <main className="container mx-auto px-4 md:px-6 py-6 space-y-6">
        <StatsCards />
        <TipHistory />
      </main>

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
      
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
      />
    </div>
  );
}