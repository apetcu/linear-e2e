import DashboardLayout from '@/components/DashboardLayout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Configure your application preferences
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-zinc-600 dark:text-zinc-400">
            Settings configuration coming soon...
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
