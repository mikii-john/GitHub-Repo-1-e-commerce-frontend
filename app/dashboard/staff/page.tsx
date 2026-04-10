'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = 'admin' | 'seller' | 'buyer' | 'staff';
type UserStatus = 'Active' | 'Blocked';

interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

interface Ticket {
  id: string;
  subject: string;
  user: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const navItems = [
  { name: 'Overview',     icon: 'dashboard',         id: 'overview'  },
  { name: 'User Control', icon: 'manage_accounts',   id: 'users'     },
  { name: 'Tickets',      icon: 'support_agent',     id: 'tickets'   },
  { name: 'Disputes',     icon: 'gavel',             id: 'disputes'  },
];

// ─── Status Pills ─────────────────────────────────────────────────────────────

const RolePill = ({ role }: { role: UserRole }) => {
  const map: Record<UserRole, string> = {
    admin:  'bg-purple-100 text-purple-700',
    seller: 'bg-blue-100 text-blue-700',
    buyer:  'bg-teal-100 text-teal-700',
    staff:  'bg-orange-100 text-orange-700',
  };
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', map[role])}>
      {role}
    </span>
  );
};

const StatusPill = ({ status }: { status: UserStatus }) => (
  <span className={cn(
    'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
    status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  )}>
    {status}
  </span>
);

const PriorityPill = ({ priority }: { priority: Ticket['priority'] }) => {
  const map: Record<Ticket['priority'], string> = {
    High:   'bg-red-100 text-red-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low:    'bg-sky-100 text-sky-700',
  };
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', map[priority])}>
      {priority}
    </span>
  );
};

const TicketStatusPill = ({ status }: { status: Ticket['status'] }) => {
  const map: Record<Ticket['status'], string> = {
    'Open':        'bg-red-50 text-red-600',
    'In Progress': 'bg-amber-50 text-amber-600',
    'Resolved':    'bg-green-50 text-green-600',
  };
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', map[status])}>
      {status}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [confirmModal, setConfirmModal] = useState<{ userId: string; action: 'block' | 'unblock' } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleBlock = (userId: string, current: UserStatus) => {
    const action = current === 'Active' ? 'block' : 'unblock';
    setConfirmModal({ userId, action });
  };

  const confirmAction = () => {
    if (!confirmModal) return;
    setUsers(prev => prev.map(u =>
      u._id === confirmModal.userId
        ? { ...u, status: confirmModal.action === 'block' ? 'Blocked' : 'Active' }
        : u
    ));
    showToast(confirmModal.action === 'block' ? 'User blocked successfully.' : 'User unblocked successfully.');
    setConfirmModal(null);
  };

  const handleRemoveSeller = (userId: string) => {
    setUsers(prev => prev.filter(u => u._id !== userId));
    showToast('Seller removed from platform.');
  };

  const handleRemoveBuyer = (userId: string) => {
    setUsers(prev => prev.filter(u => u._id !== userId));
    showToast('Buyer removed from platform.');
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, status: 'Resolved' } : t
    ));
    showToast('Ticket marked as resolved.');
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // ── Stats ──────────────────────────────────────────────────────────────────

  const stats = [
    {
      label: 'Active Users',
      value: users.filter(u => u.status === 'Active').length.toString(),
      change: 'Online Now',
      icon: 'group',
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Blocked Users',
      value: users.filter(u => u.status === 'Blocked').length.toString(),
      change: 'Restricted',
      icon: 'block',
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'Open Tickets',
      value: tickets.filter(t => t.status !== 'Resolved').length.toString(),
      change: `${tickets.filter(t => t.priority === 'High' && t.status !== 'Resolved').length} High Priority`,
      icon: 'support_agent',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Open Disputes',
      value: disputes.filter(d => d.status === 'Open').length.toString(),
      change: 'Pending Review',
      icon: 'gavel',
      color: 'bg-tertiary/10 text-tertiary',
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute roles={['staff']}>
      <div className="flex h-screen bg-[#f3f4f5] font-sans text-[#191c1d] overflow-hidden">

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside className="h-screen w-64 fixed left-0 top-0 bg-[#f8f9fa] flex flex-col py-8 px-4 z-50 border-r border-outline-variant/20">
          <div className="mb-10 px-2">
            <h1 className="text-lg font-black tracking-tighter text-on-surface">Operations Hub</h1>
            <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mt-1">Staff Portal</p>
          </div>

          <nav className="grow space-y-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                      : 'text-secondary hover:bg-surface-container-high hover:scale-[1.01]'
                  )}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-outline-variant/20">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm">
                SF
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Staff Member</p>
                <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Operations</p>
              </div>
            </div>
            <Link
              href="/"
              className="block w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-widest text-center hover:opacity-90 active:scale-95 transition-all"
            >
              View Storefront
            </Link>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <main className="ml-64 flex-1 overflow-y-auto">

          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-10 py-5 flex items-center justify-between border-b border-outline-variant/20">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                {navItems.find(n => n.id === activeTab)?.name ?? 'Dashboard'}
              </h2>
              <p className="text-sm text-secondary font-medium">Staff operations centre — moderation and support.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-green-700 uppercase tracking-wider">On Duty</span>
              </div>
              <button className="p-2.5 rounded-full hover:bg-[#f3f4f5] transition-colors relative">
                <span className="material-symbols-outlined text-[22px] text-outline">notifications</span>
                {tickets.filter(t => t.status === 'Open').length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            </div>
          </header>

          <div className="p-10 space-y-10">

            {/* ── Overview Tab ─────────────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <>
                {/* Stats grid */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((card, i) => (
                    <div
                      key={i}
                      className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border border-outline-variant/10 group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={cn('p-3 rounded-2xl', card.color)}>
                          <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                        </div>
                        <span className="text-[9px] font-black text-outline bg-[#f3f4f5] px-2 py-1 rounded-full uppercase tracking-widest">
                          {card.change}
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">{card.label}</p>
                      <h3 className="text-4xl font-black tracking-tighter">{card.value}</h3>
                    </div>
                  ))}
                </section>

                {/* Quick Action Cards */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Tickets */}
                  <div className="lg:col-span-2 bg-white rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 flex items-center justify-between">
                      <h3 className="text-lg font-black tracking-tight">Recent Tickets</h3>
                      <button onClick={() => setActiveTab('tickets')} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">
                        View All
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[#f3f4f5]/50">
                          <tr>
                            <th className="px-8 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Subject</th>
                            <th className="px-8 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Priority</th>
                            <th className="px-8 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f3f4f5]">
                          {tickets.slice(0, 3).map(t => (
                            <tr key={t.id} className="hover:bg-[#f3f4f5]/30 transition-colors">
                              <td className="px-8 py-4">
                                <p className="text-sm font-bold">{t.subject}</p>
                                <p className="text-xs text-outline">{t.user}</p>
                              </td>
                              <td className="px-8 py-4"><PriorityPill priority={t.priority} /></td>
                              <td className="px-8 py-4"><TicketStatusPill status={t.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Actions Panel */}
                  <div className="bg-white p-8 rounded-3xl border border-outline-variant/10 shadow-sm space-y-4">
                    <h3 className="text-lg font-black tracking-tight mb-6">Quick Actions</h3>
                    {[
                      { label: 'Review Open Tickets',   icon: 'support_agent', tab: 'tickets',  color: 'text-amber-600 bg-amber-50' },
                      { label: 'Manage User Access',    icon: 'manage_accounts', tab: 'users',   color: 'text-primary bg-primary/10' },
                      { label: 'View Active Disputes',  icon: 'gavel',         tab: 'disputes', color: 'text-tertiary bg-tertiary/10' },
                    ].map(action => (
                      <button
                        key={action.tab}
                        onClick={() => setActiveTab(action.tab)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[#f3f4f5] transition-all group"
                      >
                        <div className={cn('p-2.5 rounded-xl', action.color)}>
                          <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                        </div>
                        <span className="font-bold text-sm flex-1 text-left">{action.label}</span>
                        <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </button>
                    ))}

                    {/* Activity summary */}
                    <div className="mt-6 pt-6 border-t border-[#f3f4f5] space-y-3">
                      <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-3">Today's Activity</p>
                      {[
                        { label: 'Users reviewed',  value: '8' },
                        { label: 'Tickets closed',  value: '3' },
                        { label: 'Reports filed',   value: '1' },
                      ].map(item => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-sm text-secondary">{item.label}</span>
                          <span className="text-sm font-black">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Blocked Users Banner */}
                {users.filter(u => u.status === 'Blocked').length > 0 && (
                  <section className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined">warning</span>
                      </div>
                      <div>
                        <p className="font-black text-red-700">Blocked Accounts Require Review</p>
                        <p className="text-sm text-red-500">
                          {users.filter(u => u.status === 'Blocked').length} user(s) are currently restricted. Review and update as needed.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                    >
                      Review Now
                    </button>
                  </section>
                )}
              </>
            )}

            {/* ── User Control Tab ─────────────────────────────────────────── */}
            {activeTab === 'users' && (
              <section className="bg-white rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
                <div className="px-8 py-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-[#f3f4f5]">
                  <div>
                    <h3 className="text-xl font-black">User Control Panel</h3>
                    <p className="text-sm text-secondary">Block/unblock users, remove sellers or buyers.</p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">search</span>
                      <input
                        type="text"
                        placeholder="Search users…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#f3f4f5] rounded-xl text-sm font-medium text-on-surface placeholder:text-outline outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    {/* Role filter */}
                    <select
                      value={roleFilter}
                      onChange={e => setRoleFilter(e.target.value as any)}
                      className="px-4 py-2.5 bg-[#f3f4f5] rounded-xl text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                    >
                      <option value="all">All Roles</option>
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#f3f4f5]/40">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest">User</th>
                        <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Role</th>
                        <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Status</th>
                        <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f5]">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-8 py-20 text-center text-secondary italic">No users match your criteria.</td>
                        </tr>
                      ) : (
                        filteredUsers.map(user => (
                          <tr key={user._id} className="hover:bg-[#f3f4f5]/30 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  'w-9 h-9 rounded-full flex items-center justify-center font-black text-xs',
                                  user.status === 'Blocked' ? 'bg-red-100 text-red-500' : 'bg-primary/10 text-primary'
                                )}>
                                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                  <p className="text-sm font-black">{user.name}</p>
                                  <p className="text-xs text-outline">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5"><RolePill role={user.role} /></td>
                            <td className="px-8 py-5"><StatusPill status={user.status} /></td>
                            <td className="px-8 py-5">
                              <div className="flex items-center justify-end gap-2">
                                {/* Block / Unblock — applicable to buyers and sellers */}
                                {(user.role === 'buyer' || user.role === 'seller') && (
                                  <button
                                    onClick={() => handleToggleBlock(user._id, user.status)}
                                    className={cn(
                                      'text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-widest transition-colors',
                                      user.status === 'Active'
                                        ? 'text-red-600 border-red-200 hover:bg-red-50'
                                        : 'text-green-600 border-green-200 hover:bg-green-50'
                                    )}
                                  >
                                    {user.status === 'Active' ? 'Block' : 'Unblock'}
                                  </button>
                                )}
                                {/* Remove seller */}
                                {user.role === 'seller' && (
                                  <button
                                    onClick={() => handleRemoveSeller(user._id)}
                                    className="text-[10px] font-black px-4 py-2 rounded-xl border border-outline-variant/40 text-secondary hover:bg-[#f3f4f5] uppercase tracking-widest transition-colors"
                                  >
                                    Remove
                                  </button>
                                )}
                                {/* Remove buyer */}
                                {user.role === 'buyer' && (
                                  <button
                                    onClick={() => handleRemoveBuyer(user._id)}
                                    className="text-[10px] font-black px-4 py-2 rounded-xl border border-outline-variant/40 text-secondary hover:bg-[#f3f4f5] uppercase tracking-widest transition-colors"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-8 py-4 bg-[#f3f4f5]/30 flex items-center justify-between">
                  <p className="text-xs text-secondary font-medium">
                    Showing <span className="font-black text-on-surface">{filteredUsers.length}</span> of {users.length} users
                  </p>
                  <div className="flex gap-1">
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-outline-variant/20 text-xs font-bold hover:bg-[#f3f4f5] transition-colors">←</button>
                    <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold">1</button>
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-outline-variant/20 text-xs font-bold hover:bg-[#f3f4f5] transition-colors">→</button>
                  </div>
                </div>
              </section>
            )}

            {/* ── Tickets Tab ──────────────────────────────────────────────── */}
            {activeTab === 'tickets' && (
              <section className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Open',        value: tickets.filter(t => t.status === 'Open').length,        color: 'bg-red-50 text-red-700 border-red-100' },
                    { label: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length, color: 'bg-amber-50 text-amber-700 border-amber-100' },
                    { label: 'Resolved',    value: tickets.filter(t => t.status === 'Resolved').length,    color: 'bg-green-50 text-green-700 border-green-100' },
                  ].map(stat => (
                    <div key={stat.label} className={cn('rounded-2xl p-5 border', stat.color)}>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-4xl font-black">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-[#f3f4f5]">
                    <h3 className="text-xl font-black">Support Tickets</h3>
                    <p className="text-sm text-secondary">Review and resolve incoming support requests.</p>
                  </div>
                  <div className="divide-y divide-[#f3f4f5]">
                    {tickets.map(ticket => (
                      <div key={ticket.id} className="px-8 py-5 hover:bg-[#f3f4f5]/30 transition-colors flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={cn(
                            'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0',
                            ticket.priority === 'High' ? 'bg-red-100 text-red-600' :
                            ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                            'bg-sky-100 text-sky-600'
                          )}>
                            <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-sm truncate">{ticket.subject}</p>
                            <p className="text-xs text-outline">{ticket.user} · {ticket.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <PriorityPill priority={ticket.priority} />
                          <TicketStatusPill status={ticket.status} />
                          {ticket.status !== 'Resolved' && (
                            <button
                              onClick={() => handleResolveTicket(ticket.id)}
                              className="px-4 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Disputes Tab ─────────────────────────────────────────────── */}
            {activeTab === 'disputes' && (
              <section className="space-y-6">
                <div className="bg-white rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 flex items-center justify-between border-b border-[#f3f4f5]">
                    <div>
                      <h3 className="text-xl font-black">Dispute Monitor</h3>
                      <p className="text-sm text-secondary">View active disputes. Escalate to admin for resolution.</p>
                    </div>
                    <span className="bg-red-100 text-red-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                      {disputes.filter(d => d.status === 'Open').length} Open
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#f3f4f5]/40">
                        <tr>
                          <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Dispute ID</th>
                          <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Order ID</th>
                          <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Reason</th>
                          <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Opened</th>
                          <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Status</th>
                          <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f3f4f5]">
                        {disputes.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-8 py-20 text-center text-secondary italic">No disputes to display.</td>
                          </tr>
                        ) : (
                          disputes.map(d => (
                            <tr key={d._id} className="hover:bg-[#f3f4f5]/30 transition-colors">
                              <td className="px-8 py-5 font-mono text-xs text-outline font-bold">#{d._id.slice(-6)}</td>
                              <td className="px-8 py-5 font-mono text-xs text-secondary font-bold">#{typeof d.order_id === 'string' ? d.order_id.slice(-6) : d.order_id}</td>
                              <td className="px-8 py-5 text-sm font-bold">{d.reason}</td>
                              <td className="px-8 py-5 text-xs text-outline">{new Date(d.createdAt).toLocaleDateString()}</td>
                              <td className="px-8 py-5">
                                <span className={cn(
                                  'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
                                  d.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                )}>
                                  {d.status}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-right">
                                <button className="text-[10px] font-black px-4 py-2 rounded-xl border border-primary/30 text-primary hover:bg-primary/5 uppercase tracking-widest transition-colors">
                                  Escalate
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-8 py-6 bg-amber-50 border-t border-amber-100 flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-600">info</span>
                    <p className="text-xs text-amber-700 font-bold">
                      Staff can monitor and escalate disputes. Final Refund / Release decisions require Admin access.
                    </p>
                  </div>
                </div>
              </section>
            )}

          </div>
        </main>

        {/* ── Confirm Modal ────────────────────────────────────────────────── */}
        {confirmModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <div className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center mb-6',
                confirmModal.action === 'block' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              )}>
                <span className="material-symbols-outlined text-2xl">
                  {confirmModal.action === 'block' ? 'block' : 'check_circle'}
                </span>
              </div>
              <h3 className="text-xl font-black mb-2">
                {confirmModal.action === 'block' ? 'Block User?' : 'Unblock User?'}
              </h3>
              <p className="text-sm text-secondary mb-8">
                {confirmModal.action === 'block'
                  ? 'This user will lose access to the platform until unblocked by staff or admin.'
                  : 'This user will regain full platform access immediately.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 py-3 rounded-xl border border-outline-variant/30 text-sm font-black text-secondary hover:bg-[#f3f4f5] transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-white text-sm font-black uppercase tracking-widest transition-colors',
                    confirmModal.action === 'block' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  )}
                >
                  {confirmModal.action === 'block' ? 'Block' : 'Unblock'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Toast ────────────────────────────────────────────────────────── */}
        {toast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-on-surface text-white px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <span className="material-symbols-outlined text-[18px] text-green-400">check_circle</span>
            {toast}
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
