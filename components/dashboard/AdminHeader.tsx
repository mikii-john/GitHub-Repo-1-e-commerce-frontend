'use client';

import React from 'react';

// Simple icon wrapper if they don't exist, using Material Symbols
const Icon = ({ name }: { name: string }) => (
  <span className="material-symbols-outlined text-[24px] text-outline">{name}</span>
);

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-10 py-6 flex items-center justify-between border-b border-outline-variant/30">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-on-background">System Overview</h2>
        <p className="text-sm text-secondary">Real-time diagnostics and global marketplace health.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-on-surface uppercase tracking-wider">System Live: 99.9%</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
            <Icon name="notifications" />
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
            <Icon name="search" />
          </button>
        </div>
      </div>
    </header>
  );
}
