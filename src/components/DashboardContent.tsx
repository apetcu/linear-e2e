'use client';

export default function DashboardContent() {
  const stats = [
    { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', trend: 'up' },
    { label: 'Subscriptions', value: '2,350', change: '+180.1%', trend: 'up' },
    { label: 'Active Invoices', value: '156', change: '+19%', trend: 'up' },
    { label: 'Pending Payments', value: '$12,234', change: '-4.3%', trend: 'down' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInUp 0.5s ease-out forwards',
            }}
          >
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              {stat.label}
            </p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                {stat.value}
              </p>
              <span
                className={`
                  text-sm font-semibold px-2 py-1 rounded-full
                  ${
                    stat.trend === 'up'
                      ? 'text-green-600 bg-green-100 dark:bg-green-900/20'
                      : 'text-red-600 bg-red-100 dark:bg-red-900/20'
                  }
                `}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            { type: 'payment', description: 'Payment received from Acme Corp', amount: '+$2,400', time: '2 hours ago' },
            { type: 'invoice', description: 'Invoice #1234 sent to Client A', amount: '$1,200', time: '5 hours ago' },
            { type: 'subscription', description: 'New subscription activated', amount: '+$99/mo', time: '1 day ago' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${activity.type === 'payment' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : ''}
                  ${activity.type === 'invoice' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : ''}
                  ${activity.type === 'subscription' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' : ''}
                `}>
                  {activity.type === 'payment' && '💰'}
                  {activity.type === 'invoice' && '📄'}
                  {activity.type === 'subscription' && '⭐'}
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {activity.time}
                  </p>
                </div>
              </div>
              <span className={`
                font-semibold
                ${activity.amount.startsWith('+') ? 'text-green-600' : 'text-zinc-900 dark:text-white'}
              `}>
                {activity.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
