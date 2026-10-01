'use client';

import React, { useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { ToastContainer } from '@/components/common/Toast';
import { AuthModal } from '@/components/modals/AuthModal';
import { BuyCreditsModal } from '@/components/modals/BuyCreditsModal';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { SaveToProjectModal } from '@/components/modals/SaveToProjectModal';
import { AssetDetailModal } from '@/components/modals/AssetDetailModal';
import { NewProjectModal } from '@/components/modals/NewProjectModal';
import { SignInView } from '@/components/views/SignInView';
import { LandingView } from '@/components/views/LandingView';

function LandingRouteContent() {
  const { authRole, setCurrentScreen } = useApp();

  useEffect(() => {
    setCurrentScreen('landing');
  }, [setCurrentScreen]);

  if (!authRole) {
    return <SignInView />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col selection:bg-purple-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <LandingView />
      </main>

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

export default function LandingPage() {
  return (
    <AppProvider>
      <LandingRouteContent />
    </AppProvider>
  );
}
