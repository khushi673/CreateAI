'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminCreditManagement } from '@/components/admin/AdminCreditManagement';
import { AdminSubscriptionManagement } from '@/components/admin/AdminSubscriptionManagement';
import { AdminLLMConfiguration } from '@/components/admin/AdminLLMConfiguration';
import { AdminView } from '@/components/views/AdminView';
import { ToastContainer } from '@/components/common/Toast';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function AdminContent() {
  const { authRole, loginAsAdmin } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'credits' | 'subscriptions' | 'models' | 'llm'>('overview');

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col selection:bg-rose-600 selection:text-white">
      {/* Dedicated Admin Header */}
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'overview' && <AdminView />}
        {activeTab === 'users' && <AdminUserManagement />}
        {activeTab === 'credits' && <AdminCreditManagement />}
        {activeTab === 'subscriptions' && <AdminSubscriptionManagement />}
        {activeTab === 'models' && <AdminCreditManagement />}
        {activeTab === 'llm' && <AdminLLMConfiguration />}
      </main>

      <ToastContainer />
    </div>
  );
}

export default function AdminPage() {
  return (
    <AppProvider>
      <AdminContent />
    </AppProvider>
  );
}
