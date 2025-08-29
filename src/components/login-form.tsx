'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/store';
import { Loader2, UserCheck } from 'lucide-react';

export function LoginForm() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(code);
    if (!success) {
      setError('Invalid employee code. Please check and try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#71FF71] flex items-center justify-center">
            <UserCheck className="w-8 h-8 text-gray-900" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to TipTop
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Enter your unique employee code to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Employee Code
              </Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter your unique code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-12 text-center text-lg tracking-wider font-mono border-gray-200 dark:border-gray-700 focus:border-[#71FF71] focus:ring-[#71FF71]/20"
                required
              />
            </div>
            
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#71FF71] hover:bg-[#5eeb5e] text-gray-900 font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={isLoading || code.length < 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}