import DashboardLayout from '@/components/DashboardLayout';

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            User Profile
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your profile and account information
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              A
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Admin User</h2>
              <p className="text-zinc-600 dark:text-zinc-400">admin@finance.app</p>
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Profile management features coming soon...
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
