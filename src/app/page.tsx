'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastContainer } from '@/components/common/Toast';
import { AuthModal } from '@/components/modals/AuthModal';
import { BuyCreditsModal } from '@/components/modals/BuyCreditsModal';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { SaveToProjectModal } from '@/components/modals/SaveToProjectModal';
import { AssetDetailModal } from '@/components/modals/AssetDetailModal';
import { NewProjectModal } from '@/components/modals/NewProjectModal';

// Views
import { SignInView } from '@/components/views/SignInView';
import { LandingView } from '@/components/views/LandingView';
import { DashboardView } from '@/components/views/DashboardView';
import { CreateView } from '@/components/views/CreateView';
import { HistoryView } from '@/components/views/HistoryView';
import { ProjectsView } from '@/components/views/ProjectsView';
import { ProjectDetailView } from '@/components/views/ProjectDetailView';
import { PricingView } from '@/components/views/PricingView';
import { CreditsView } from '@/components/views/CreditsView';
import { ProfileView } from '@/components/views/ProfileView';

function AppContent() {
  const { authRole, currentScreen } = useApp();

  // If not logged in, show single Sign In portal
  if (!authRole) {
    return <SignInView />;
  }

  const isLanding = currentScreen === 'landing';

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar />

      {isLanding ? (
        /* Standalone Landing View */
        <main className="flex-1">
          <LandingView />
        </main>
      ) : (
        /* Workspace App Layout with Sidebar */
        <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
          <Sidebar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
            {currentScreen === 'dashboard' && <DashboardView />}
            {currentScreen === 'create' && <CreateView />}
            {currentScreen === 'history' && <HistoryView />}
            {currentScreen === 'projects' && <ProjectsView />}
            {currentScreen === 'project-detail' && <ProjectDetailView />}
            {currentScreen === 'pricing' && <PricingView />}
            {currentScreen === 'credits' && <CreditsView />}
            {currentScreen === 'profile' && <ProfileView />}
          </main>
        </div>
      )}

      {/* Global Modals & Toasts */}
      <AuthModal />
      <BuyCreditsModal />
      <UpgradeModal />
      <SaveToProjectModal />
      <AssetDetailModal />
      <NewProjectModal />
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
