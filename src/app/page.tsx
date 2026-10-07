'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastContainer } from '@/components/common/Toast';
import { AuthModal } from '@/components/modals/AuthModal';
import { BuyCreditsModal } from '@/components/modals/BuyCreditsModal';
import { SaveToProjectModal } from '@/components/modals/SaveToProjectModal';
import { NewProjectModal } from '@/components/modals/NewProjectModal';

// Views
import { SignInView } from '@/components/views/SignInView';
import { LandingView } from '@/components/views/LandingView';
import { DashboardView } from '@/components/views/DashboardView';
import { CreateView } from '@/components/views/CreateView';
import { ResultView } from '@/components/views/ResultView';
import { CompareView } from '@/components/views/CompareView';
import { ReferenceLibraryView } from '@/components/views/ReferenceLibraryView';
import { HistoryView } from '@/components/views/HistoryView';
import { ProjectsView } from '@/components/views/ProjectsView';
import { ProjectDetailView } from '@/components/views/ProjectDetailView';
import { PromptBuilderView } from '@/components/views/PromptBuilderView';
import { StoryboardView } from '@/components/views/StoryboardView';
import { ToolsView } from '@/components/views/ToolsView';
import { CollaborationView } from '@/components/views/CollaborationView';
import { CreditsView } from '@/components/views/CreditsView';
import { ProfileView } from '@/components/views/ProfileView';

function AppContent() {
  const { authRole, currentScreen } = useApp();
  const router = useRouter();

  // The Admin panel lives on its own route and layout; never render it inside the user shell.
  useEffect(() => {
    if (authRole === 'admin') router.replace('/admin');
  }, [authRole, router]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentScreen]);

  if (!authRole || authRole === 'admin') {
    return (
      <>
        <SignInView />
        <ToastContainer />
      </>
    );
  }

  const isLanding = currentScreen === 'landing';

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col selection:bg-purple-600 selection:text-white">
      <Navbar />

      {isLanding ? (
        <main className="flex-1">
          <LandingView />
        </main>
      ) : (
        <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
          <Sidebar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
            {currentScreen === 'dashboard' && <DashboardView />}
            {currentScreen === 'create' && <CreateView />}
            {currentScreen === 'result' && <ResultView />}
            {currentScreen === 'compare' && <CompareView />}
            {currentScreen === 'references' && <ReferenceLibraryView />}
            {currentScreen === 'history' && <HistoryView />}
            {currentScreen === 'projects' && <ProjectsView />}
            {currentScreen === 'project-detail' && <ProjectDetailView />}
            {currentScreen === 'prompt-builder' && <PromptBuilderView />}
            {currentScreen === 'storyboard' && <StoryboardView />}
            {currentScreen === 'tools' && <ToolsView />}
            {currentScreen === 'collaboration' && <CollaborationView />}
            {currentScreen === 'credits' && <CreditsView />}
            {currentScreen === 'profile' && <ProfileView />}
          </main>
        </div>
      )}

      <AuthModal />
      <BuyCreditsModal />
      <SaveToProjectModal />
      <NewProjectModal />
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return <AppContent />;
}
