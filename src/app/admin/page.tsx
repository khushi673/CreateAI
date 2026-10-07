'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AdminShell, AdminPageId } from '@/components/admin/AdminShell';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminCredits } from '@/components/admin/AdminCredits';
import { AdminSubscriptions } from '@/components/admin/AdminSubscriptions';
import { AdminModels } from '@/components/admin/AdminModels';
import { AdminMonitoring } from '@/components/admin/AdminMonitoring';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminAnnouncements } from '@/components/admin/AdminAnnouncements';
import { ToastContainer } from '@/components/common/Toast';

export default function AdminPage() {
  const { authRole } = useApp();
  const router = useRouter();
  const [page, setPage] = useState<AdminPageId>('dashboard');

  useEffect(() => {
    if (authRole !== 'admin') router.replace('/');
  }, [authRole, router]);

  if (authRole !== 'admin') return null;

  return (
    <>
      <AdminShell page={page} onNavigate={setPage}>
        {page === 'dashboard' && <AdminDashboard />}
        {page === 'users' && <AdminUsers />}
        {page === 'credits' && <AdminCredits />}
        {page === 'subscriptions' && <AdminSubscriptions />}
        {page === 'models' && <AdminModels />}
        {page === 'monitoring' && <AdminMonitoring />}
        {page === 'analytics' && <AdminAnalytics />}
        {page === 'announcements' && <AdminAnnouncements />}
      </AdminShell>
      <ToastContainer />
    </>
  );
}
