'use client';

import { useAuthStore } from '@/lib/store';
import { LoginForm } from '@/components/login-form';
import { EmployeeDashboard } from '@/components/employee-dashboard';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <EmployeeDashboard /> : <LoginForm />;
}