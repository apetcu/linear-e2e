'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Invoices', href: '/invoices', icon: '🧾' },
  { name: 'Subscriptions', href: '/subscriptions', icon: '🔄' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
  { name: 'User Profile', href: '/profile', icon: '👤' },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-gradient-to-b from-zinc-900 to-zinc-950
        border-r border-zinc-800 transition-all duration-300 ease-in-out z-50
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <h1
          className={`
            text-xl font-bold text-white transition-opacity duration-300
            ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}
          `}
        >
          Finance
        </h1>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-zinc-400 hover:text-white transition-colors duration-200 p-1 rounded-lg hover:bg-zinc-800"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setActiveItem(item.name)}
            className={`
              flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200
              ${
                activeItem === item.name
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            <span
              className={`
                font-medium transition-opacity duration-300
                ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}
              `}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
        <div
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800/50
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div
            className={`
              transition-opacity duration-300
              ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}
            `}
          >
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-zinc-400">admin@finance.app</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
