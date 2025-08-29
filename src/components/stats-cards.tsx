'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTipsStore } from '@/lib/store';
import { formatCurrency } from '@/lib/currency';
import { TrendingUp, Wallet, Calendar, Target } from 'lucide-react';

export function StatsCards() {
  const { totalEarnings, todayEarnings, tips } = useTipsStore();
  
  const thisWeekEarnings = tips
    .filter(tip => {
      const tipDate = new Date(tip.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return tipDate >= weekAgo;
    })
    .reduce((sum, tip) => sum + tip.amount, 0);

  const totalTips = tips.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#71FF71]/10 to-emerald-50 dark:from-[#71FF71]/5 dark:to-emerald-900/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Today's Tips
          </CardTitle>
          <Calendar className="h-4 w-4 text-[#71FF71]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(todayEarnings)}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            +12% from yesterday
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            This Week
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(thisWeekEarnings)}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            +8% from last week
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Total Earned
          </CardTitle>
          <Wallet className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalEarnings)}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            All time earnings
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Total Tips
          </CardTitle>
          <Target className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalTips}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tips received
          </p>
        </CardContent>
      </Card>
    </div>
  );
}