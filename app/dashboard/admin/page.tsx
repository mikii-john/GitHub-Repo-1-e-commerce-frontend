'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import AdminHeader from '@/components/dashboard/AdminHeader';
import { cn } from '@/lib/utils';
import api from '@/lib/api';


interface Staff {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Dispute {
  _id: string;
  order_id: {
    _id: string;
    total_amount: number;
  } | string;
  reason: string;
  status: 'Open' | 'Resolved';
  resolution?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const staffRes = await api.get('/admin/staff');
        setStaff(staffRes.data);
        const disputeRes = await api.get('/admin/disputes');
        setDisputes(disputeRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleResolveDispute = async (id: string, resolution: 'Refund' | 'Release') => {
    setDisputes(disputes.map(d => d._id === id ? { ...d, status: 'Resolved', resolution } : d));
  };

  const handleRemoveStaff = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    setStaff(staff.filter(s => s._id !== id));
  };

  return (
    <ProtectedRoute roles={['admin']}>
      <div className="flex h-screen bg-surface font-sans text-on-surface">
        <AdminSidebar />
        
        <main className="ml-64 flex-1 overflow-y-auto flex flex-col bg-surface-container-low/30">
          <AdminHeader />

          <div className="p-10 space-y-10">
            {/* Bento Grid Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Sales', value: '$4,281,950', change: '+12.4%', icon: 'payments', color: 'primary' },
                { label: 'Active Users', value: '84,102', change: '+3.1%', icon: 'group', color: 'tertiary' },
                { label: 'Total Orders', value: '12,540', change: 'Steady', icon: 'shopping_bag', color: 'orange-100' },
                { label: 'System Health', value: '98%', status: 'Stable', icon: 'health_and_safety', color: 'green-100' }
              ].map((card, i) => (
                <div key={i} className="bg-surface-container-lowest p-6 rounded-default shadow-sm hover:shadow-md transition-all border border-outline-variant/10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-3 rounded-xl", 
                      card.color === 'primary' ? 'bg-primary/10 text-primary' : 
                      card.color === 'tertiary' ? 'bg-tertiary/10 text-tertiary' : 
                      card.color === 'orange-100' ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    )}>
                      <span className="material-symbols-outlined">{card.icon}</span>
                    </div>
                    <span className={cn("text-[10px] font-black px-2 py-1 rounded-full uppercase",
                      card.change === 'Steady' ? 'text-outline bg-surface-container-high' :
                      card.change?.startsWith('+') ? 'text-green-600 bg-green-50' : 
                      'text-green-600 bg-green-50'
                    )}>
                      {card.change || card.status}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">{card.label}</p>
                  <h3 className="text-3xl font-black tracking-tighter">{card.value}</h3>
                  {card.label === 'System Health' && (
                    <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden mt-3">
                      <div className="h-full bg-green-500 w-[98%]"></div>
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* User Management Section */}
            <section className="bg-surface-container-lowest rounded-default border border-outline-variant/10 overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-surface-container-low flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">Staff & User Management</h3>
                  <p className="text-sm text-secondary">Manage administrative staff and platform access.</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-surface-container-low text-on-surface text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-surface-container-high transition-colors">Export CSV</button>
                  <button className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-xl hover:opacity-90 transition-opacity">Add Staff Member</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low/30">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Identity</th>
                      <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Role</th>
                      <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-outline uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    {loading ? (
                      [1, 2, 3].map(i => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={4} className="px-8 py-6 h-16 bg-surface-container-low/10"></td>
                        </tr>
                      ))
                    ) : staff.length === 0 ? (
                      <tr><td colSpan={4} className="px-8 py-20 text-center text-secondary">No staff members found.</td></tr>
                    ) : (
                      staff.map((member) => (
                        <tr key={member._id} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-black">{member.name}</p>
                                <p className="text-xs text-outline">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-xs font-bold text-secondary capitalize">{member.role}</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase">Active</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button 
                              onClick={() => handleRemoveStaff(member._id)}
                              className="text-[10px] font-black text-error px-4 py-2 rounded-xl border border-error/20 hover:bg-error/5 transition-colors uppercase tracking-widest"
                            >
                              Revoke Access
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Arbitration & Transactions */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Disputes Table */}
              <div className="lg:col-span-2 bg-surface-container-lowest rounded-default border border-outline-variant/10 shadow-sm overflow-hidden">
                <div className="px-8 py-6 flex items-center justify-between">
                  <h3 className="text-lg font-black tracking-tight">Active Disputes</h3>
                  <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Monitor All Transactions</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low/30">
                      <tr>
                        <th className="px-8 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Order ID</th>
                        <th className="px-8 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Reason</th>
                        <th className="px-8 py-3 text-[10px] font-black text-outline uppercase tracking-widest">Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-low">
                      {disputes.length === 0 ? (
                        <tr><td colSpan={3} className="px-8 py-10 text-center text-outline">No pending disputes.</td></tr>
                      ) : (
                        disputes.map((dispute) => (
                          <tr key={dispute._id} className="hover:bg-surface-container-low/20 transition-colors">
                            <td className="px-8 py-4 text-xs font-mono font-bold text-secondary">#{dispute._id.slice(-6)}</td>
                            <td className="px-8 py-4 text-sm font-bold">{dispute.reason}</td>
                            <td className="px-8 py-4">
                              {dispute.status === 'Open' ? (
                                <div className="flex gap-2">
                                  <button onClick={() => handleResolveDispute(dispute._id, 'Refund')} className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-error border border-error/20 hover:bg-error/5">Refund</button>
                                  <button onClick={() => handleResolveDispute(dispute._id, 'Release')} className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase bg-primary text-white">Release</button>
                                </div>
                              ) : (
                                <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded uppercase">Resolved</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Support Center & System Stats */}
              <div className="space-y-6">
                <div className="bg-surface-container-lowest p-8 rounded-default border border-outline-variant/10 shadow-sm flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-3xl">support_agent</span>
                    </div>
                    <h3 className="text-xl font-black tracking-tight">Support Node</h3>
                  </div>
                  <div className="space-y-6 flex-grow">
                    <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/5">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Open Tickets</p>
                      <h4 className="text-4xl font-black">14</h4>
                      <p className="text-[10px] text-outline mt-2 font-bold uppercase">4 High Priority tickets need review.</p>
                    </div>
                    <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/5">
                      <p className="text-[10px] font-black text-tertiary uppercase tracking-widest mb-1">Server Latency</p>
                      <h4 className="text-4xl font-black">24ms</h4>
                      <p className="text-[10px] text-outline mt-2 font-bold uppercase">Global average response time.</p>
                    </div>
                  </div>
                  <button className="w-full mt-8 py-4 bg-surface-container-high text-on-surface text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-outline-variant/20 transition-all">
                    Access Tickets
                  </button>
                </div>
              </div>
            </section>
          </div>
          
          {/* Floating Action Button */}
          <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50">
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </main>
      </div>
    </ProtectedRoute>
  );
}
