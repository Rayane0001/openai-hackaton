// @file src/components/layout/header.tsx
// Main navigation header with clean design

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'New Decision', href: '/decision', icon: '🤔' },
  { name: 'Scenarios', href: '/scenarios', icon: '🔮' },
];

export default function Header() {
  const pathname = usePathname();

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">FS</span>
              </div>
              <span className="font-semibold text-lg">Future Self</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              {navigation.map((item) => (
                  <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          pathname === item.href
                              ? "bg-purple-100 text-purple-700"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      )}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
              ))}
            </nav>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>
  );
}