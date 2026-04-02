'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { 
  Users, 
  ShieldAlert, 
  BarChart3, 
  Settings, 
  UserPlus, 
  Trash2, 
  CheckCircle,
  XCircle,
  Filter,
  MoreVertical,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'disputes'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [staffRes, disputesRes] = await Promise.all([
        api.get('/admin/staff'),
        api.get('/disputes')
      ]);
      setStaff(staffRes.data);
      setDisputes(disputesRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (id: string, resolution: 'Refund' | 'Release') => {
    try {
      await api.patch(`/disputes/${id}/resolve`, { resolution });
      setDisputes(disputes.map(d => d._id === id ? { ...d, status: 'Resolved', resolution } : d));
    } catch (error) {
      console.error('Error resolving dispute', error);
    }
  };

  const handleRemoveStaff = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await api.delete(`/admin/staff/${id}`);
      setStaff(staff.filter(s => s._id !== id));
    } catch (error) {
      console.error('Error removing staff', error);
    }
  };

  return (
    <ProtectedRoute roles={['admin']}>
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black mb-2">Admin Control Center</h1>
              <p className="text-muted">System-wide monitoring, staff management, and dispute arbitration.</p>
            </div>
            <div className="flex bg-card border border-border rounded-2xl p-1 shadow-sm">
               {['overview', 'staff', 'disputes'].map((tab) => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                     activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:text-foreground'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-12">
               {/* Dashboard Stats */}
               <div className="grid md:grid-cols-4 gap-8">
                  <div className="p-8 bg-card border border-border rounded-3xl">
                     <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                        <Users className="w-6 h-6" />
                     </div>
                     <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Total Users</h3>
                     <p className="text-3xl font-black">1,280</p>
                     <p className="text-xs text-green-500 font-bold mt-2">+12% from last month</p>
                  </div>
                  <div className="p-8 bg-card border border-border rounded-3xl">
                     <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                        <ShieldAlert className="w-6 h-6" />
                     </div>
                     <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Open Disputes</h3>
                     <p className="text-3xl font-black">{disputes.filter(d => d.status === 'Open').length}</p>
                     <p className="text-xs text-orange-500 font-bold mt-2">Requires attention</p>
                  </div>
                  <div className="p-8 bg-card border border-border rounded-3xl">
                     <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                        <BarChart3 className="w-6 h-6" />
                     </div>
                     <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Volume (24h)</h3>
                     <p className="text-3xl font-black">$45,200</p>
                     <p className="text-xs text-green-500 font-bold mt-2">Active escrow</p>
                  </div>
                  <div className="p-8 bg-card border border-border rounded-3xl">
                     <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
                        <Activity className="w-6 h-6" />
                     </div>
                     <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Success Rate</h3>
                     <p className="text-3xl font-black">99.8%</p>
                     <p className="text-xs text-purple-500 font-bold mt-2">Orders fulfilled</p>
                  </div>
               </div>

               <div className="grid lg:grid-cols-2 gap-8">
                  <div className="p-8 bg-card border border-border rounded-3xl">
                     <h3 className="text-xl font-black mb-6">Real-time Activity</h3>
                     <div className="space-y-6">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold font-mono">JW</div>
                             <div className="flex-grow">
                                <p className="text-sm font-bold">New user registered <span className="text-muted font-normal">as Seller</span></p>
                                <p className="text-[10px] text-muted">2 minutes ago</p>
                             </div>
                             <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase">Verified</div>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="p-8 bg-card border border-border rounded-3xl">
                     <h3 className="text-xl font-black mb-6">System Health</h3>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <div className="flex justify-between text-xs font-bold uppercase">
                              <span>API Gateway</span>
                              <span className="text-green-500">Operational</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full w-full bg-green-500"></div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-xs font-bold uppercase">
                              <span>Database Cluster</span>
                              <span className="text-green-500">99.9% Up</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full w-[99%] bg-green-500"></div>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-xs font-bold uppercase">
                              <span>Payment Provider</span>
                              <span className="text-blue-500">Connected</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full w-full bg-blue-500"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black">Management Staff</h2>
                  <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center gap-2">
                     <UserPlus className="w-4 h-4" /> Add Staff Member
                  </button>
               </div>

               <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-border">
                        <tr>
                           <th className="px-8 py-4 text-[10px] font-black text-muted uppercase tracking-widest">Name</th>
                           <th className="px-8 py-4 text-[10px] font-black text-muted uppercase tracking-widest">Role</th>
                           <th className="px-8 py-4 text-[10px] font-black text-muted uppercase tracking-widest">Status</th>
                           <th className="px-8 py-4 text-[10px] font-black text-muted uppercase tracking-widest">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {loading ? (
                          [1,2,3].map(i => <tr key={i}><td colSpan={4} className="px-8 py-6 h-16 animate-pulse bg-slate-100 dark:bg-slate-800/50"></td></tr>)
                        ) : staff.length === 0 ? (
                           <tr><td colSpan={4} className="px-8 py-20 text-center text-muted">No staff members found.</td></tr>
                        ) : (
                          staff.map((member) => (
                            <tr key={member._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                               <td className="px-8 py-6">
                                  <div className="font-bold">{member.name}</div>
                                  <div className="text-xs text-muted">{member.email}</div>
                               </td>
                               <td className="px-8 py-6 capitalize font-medium text-sm">{member.role}</td>
                               <td className="px-8 py-6">
                                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-black border border-green-500/20 rounded uppercase">Active</span>
                               </td>
                               <td className="px-8 py-6">
                                  <button onClick={() => handleRemoveStaff(member._id)} className="p-2 text-muted hover:text-red-500 transition-colors">
                                     <Trash2 className="w-5 h-5" />
                                  </button>
                               </td>
                            </tr>
                          ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'disputes' && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black">Escrow Arbitration</h2>
                  <div className="flex gap-4">
                     <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-xs font-bold">
                        <Filter className="w-4 h-4" /> All Disputes
                     </button>
                  </div>
               </div>

               <div className="grid gap-6">
                  {loading ? (
                    [1,2].map(i => <div key={i} className="h-40 bg-card border border-border animate-pulse rounded-3xl"></div>)
                  ) : disputes.length === 0 ? (
                    <div className="p-20 text-center bg-card rounded-3xl border border-dashed border-border flex flex-col items-center">
                       <ShieldAlert className="w-16 h-16 text-muted mb-4 opacity-30" />
                       <h3 className="text-xl font-bold mb-2">Clean Slate</h3>
                       <p className="text-muted">No active disputes in the system.</p>
                    </div>
                  ) : (
                    disputes.map((dispute) => (
                      <motion.div 
                        key={dispute._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-8 bg-card border rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all ${
                          dispute.status === 'Open' ? 'border-orange-500/20 shadow-lg shadow-orange-500/5' : 'border-border'
                        }`}
                      >
                         <div className="flex items-start gap-6">
                            <div className={`p-4 rounded-2xl ${dispute.status === 'Open' ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-100 text-slate-400'}`}>
                               <AlertTriangle className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                               <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-muted">ID: #{dispute._id.slice(-6)}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    dispute.status === 'Open' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                  }`}>{dispute.status}</span>
                               </div>
                               <h4 className="text-xl font-black">{dispute.reason}</h4>
                               <p className="text-sm text-muted">Order Total: <span className="font-bold text-foreground">${typeof dispute.order_id !== 'string' ? dispute.order_id.total_amount?.toFixed(2) : '---'}</span> • Raised on {new Date(dispute.createdAt).toLocaleDateString()}</p>
                            </div>
                         </div>

                         <div className="flex items-center gap-4">
                            {dispute.status === 'Open' ? (
                              <>
                                <button 
                                  onClick={() => handleResolveDispute(dispute._id, 'Refund')}
                                  className="px-6 py-4 border border-border rounded-2xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all hover:border-red-500"
                                >
                                   Refund Buyer
                                </button>
                                <button 
                                  onClick={() => handleResolveDispute(dispute._id, 'Release')}
                                  className="px-6 py-4 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                                >
                                   Release to Seller
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-sm font-bold text-muted bg-slate-100 dark:bg-slate-800/50 px-6 py-4 rounded-2xl">
                                 <CheckCircle className="w-5 h-5 text-green-500" /> Resolved by {dispute.resolution}
                              </div>
                            )}
                         </div>
                      </motion.div>
                    ))
                  )}
               </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
