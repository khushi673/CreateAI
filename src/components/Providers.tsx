'use client';

import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';

/** Single app-wide provider so User and Admin routes share mock state (e.g. announcements, model status). */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      {children}
      <ThemeSwitcher />
    </AppProvider>
  );
}
