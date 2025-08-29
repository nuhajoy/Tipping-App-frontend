'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTipsStore } from '@/lib/store';
import { formatCurrency } from '@/lib/currency';
import { formatDistanceToNow } from 'date-fns';
import { Search, Gift, MessageSquare, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function TipHistory() {
  const { tips } = useTipsStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTips = tips.filter(tip =>
    tip.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Gift className="w-5 h-5 mr-2 text-[#71FF71]" />
            Tip History
          </CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTips.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchQuery ? 'No tips found matching your search' : 'No tips received yet'}
              </p>
            </div>
          ) : (
            filteredTips.map((tip) => (
              <div
                key={tip.id}
                className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-200 bg-gray-50/50 dark:bg-gray-800/50"
              >
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-[#71FF71] text-gray-900 font-semibold">
                    {tip.customerName?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {tip.customerName || 'Anonymous Customer'}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(tip.timestamp, { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#71FF71]">
                        {formatCurrency(tip.amount)}
                      </p>
                      <Badge className={getStatusColor(tip.status)}>
                        {tip.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {tip.message && (
                    <div className="flex items-start space-x-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                        "{tip.message}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}