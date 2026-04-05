'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: 'dashboard', href: '/dashboard/admin' },
  { name: 'Orders', icon: 'package_2', href: '#' },
  { name: 'Inventory', icon: 'inventory_2', href: '#' },
  { name: 'Customers', icon: 'group', href: '#' },
  { name: 'Analytics', icon: 'monitoring', href: '#' },
  { name: 'Settings', icon: 'settings', href: '#' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-slate-950 flex flex-col py-6 px-4 z-50 border-r border-outline-variant/30">
      <div className="mb-10 px-2">
        <h1 className="text-lg font-black text-on-surface tracking-tighter">Management Console</h1>
        <p className="text-xs font-medium text-outline uppercase tracking-widest mt-1">Admin Portal</p>
      </div>
      
      <nav className="grow space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 py-3 px-4 rounded-lg font-sans text-sm font-medium transition-all hover:scale-[1.02]",
                isActive 
                  ? "bg-primary/10 text-primary border-l-4 border-primary shadow-sm" 
                  : "text-secondary hover:bg-surface-container-high"
              )}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/30">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            AC
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Alex Curator</p>
            <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Super Admin</p>
          </div>
        </div>
        <Link 
          href="/"
          className="block w-full py-2.5 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-widest text-center hover:opacity-90 active:scale-95 transition-all"
        >
          View Storefront
        </Link>
      </div>
    </aside>
  );
}
