'use client';

import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <main className="flex-1 ml-64 transition-all duration-300">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
