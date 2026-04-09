'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  MoreVertical,
  MapPin,
  Mail,
  Smartphone,
  Edit2,
  ShieldCheck,
  Zap,
  Receipt,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockOrders } from '@/lib/mockData';

interface Order {
  _id: string;
  product_id: any;
  total_amount: number;
  quantity: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_status: 'Unpaid' | 'Held' | 'Released' | 'Refunded';
  tracking_number?: string;
  createdAt: string;
}

const SidebarLink = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <Link 
    href="#" 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-bold' 
        : 'text-slate-500 hover:bg-slate-100 hover:scale-[1.02]'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
    <span>{label}</span>
  </Link>
);

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/orders');
        // If no data or error, use mock data
        setOrders(data.length > 0 ? data : mockOrders as any);
      } catch (error) {
        console.error('Failed to fetch buyer orders, falling back to mock data', error);
        setOrders(mockOrders as any);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirmDelivery = async (orderId: string) => {
    setConfirming(orderId);
    setTimeout(() => {
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'Delivered', payment_status: 'Released' } 
          : order
      ));
      setConfirming(null);
    }, 1500);
  };

  const stats = [
    { 
      label: 'Total Spent', 
      value: orders.length > 0 ? `$${orders.reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}` : '$0.00', 
      change: '+12% vs last month', 
      icon: CreditCard, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      label: 'Orders', 
      value: orders.length.toString().padStart(2, '0'), 
      change: `${orders.filter(o => o.status !== 'Delivered').length} in progress`, 
      icon: Truck, 
      color: 'bg-purple-100 text-purple-600' 
    },
  ];

  return (
    <ProtectedRoute roles={['buyer']}>
      <div className="flex min-h-screen bg-[#f8f9fa] text-slate-900 font-sans">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col py-8 px-4 z-40">
          <div className="mb-12 px-4">
            <span className="text-2xl font-black tracking-tighter text-slate-900">CURATOR</span>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-bold">Buyer Portal</p>
          </div>
          
          <nav className="flex-1 space-y-1">
            <SidebarLink icon={LayoutDashboard} label="Dashboard" active />
            <SidebarLink icon={Package} label="Orders" />
            <SidebarLink icon={Zap} label="Wishlist" />
            <SidebarLink icon={BarChart3} label="Analytics" />
            <SidebarLink icon={Settings} label="Settings" />
          </nav>

          <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {user ? getInitials(user.name) : '??'}
              </div>
              <div>
                <p className="text-xs font-bold truncate max-w-[100px]">{user?.name || 'Guest Buyer'}</p>
                <p className="text-[10px] text-slate-500 font-medium tracking-tight uppercase">Buyer Account</p>
              </div>
            </div>
            <button className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
              Marketplace
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-10 max-w-7xl">
          {/* Header */}
          <header className="flex justify-between items-center mb-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Buyer Overview</h1>
              <p className="text-slate-500 font-medium">Welcome back, {user?.name.split(' ')[0]}. Your recent orders are shown below.</p>
            </motion.div>
            
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                    {stat.change}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
              </motion.div>
            ))}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-600/20 relative overflow-hidden group"
            >
              <div className="relative z-10 h-full flex flex-col justify-between text-white">
                <div>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Membership Status</p>
                  <p className="text-2xl font-black mt-1 text-white">Elite Curator</p>
                </div>
                <div className="flex items-center gap-2 mt-4 bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold">Verified Account</span>
                </div>
              </div>
              <CheckCircle className="absolute -right-4 -bottom-4 text-[10rem] text-white/10 group-hover:scale-110 transition-transform duration-500" />
            </motion.div>
          </div>

          {/* Action Required: Confirm Delivery */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10"
          >
            <div className="bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="bg-slate-50/50 rounded-[1.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 p-2 flex items-center justify-center overflow-hidden">
                    <Package className="w-10 h-10 text-slate-200" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">Action Required</span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">Confirm Delivery: Chronos X-1</h3>
                    <p className="text-slate-500 text-sm mt-1">Order arrived yesterday. Confirm receipt to release payment.</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleConfirmDelivery('o2')}
                    disabled={confirming === 'o2'}
                    className="flex-1 md:flex-none px-8 py-3.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {confirming === 'o2' ? 'Confirming...' : 'Confirm Delivery'}
                  </button>
                  <button className="p-3.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all">
                    <AlertCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Recent Orders Table */}
          <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm mb-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Recent Orders</h2>
              <Link href="#" className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1">
                View All History <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-4 font-bold text-[10px] uppercase tracking-widest">Order ID</th>
                    <th className="pb-4 font-bold text-[10px] uppercase tracking-widest">Product</th>
                    <th className="pb-4 font-bold text-[10px] uppercase tracking-widest">Date</th>
                    <th className="pb-4 font-bold text-[10px] uppercase tracking-widest">Status</th>
                    <th className="pb-4 font-bold text-[10px] uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-400 font-medium italic">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 font-mono text-xs text-slate-400">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center p-2">
                              <Package className="w-5 h-5 text-slate-300" />
                            </div>
                            <span className="font-bold text-sm text-slate-900">{typeof order.product_id === 'object' ? order.product_id.name : 'Product ITEM'}</span>
                          </div>
                        </td>
                        <td className="py-5 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-5 text-right">
                          <button className="text-slate-400 hover:text-blue-600 p-2 transition-colors">
                            {order.status === 'Shipped' ? (
                              <span className="text-[10px] font-black underline uppercase">Track</span>
                            ) : (
                              <MoreVertical className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom Grid: Map and Security */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-[2rem] overflow-hidden h-72 relative group border border-slate-800">
              <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&q=80')] bg-cover bg-center group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-2xl z-10 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  <p className="text-xs font-bold text-white">Live Tracking: Package in Austin, TX Hub</p>
                </div>
              </div>
              <div className="absolute top-6 right-6 z-10">
                <button className="bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Account Security</h3>
                <p className="text-slate-500 text-sm mb-6">Your account is secured with 2FA and Biometric Passkeys.</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">{user?.email || 'email@example.com'}</span>
                    </div>
                    <span className="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase tracking-tighter">Verified</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">********4421</span>
                    </div>
                    <Edit2 className="w-3.5 h-3.5 text-blue-600 cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end gap-3">
                <button className="px-5 py-2.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-500 hover:bg-slate-100 transition-colors uppercase tracking-widest">Privacy Center</button>
                <button className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-[10px] font-black hover:bg-blue-700 transition-all uppercase tracking-widest shadow-lg shadow-blue-600/10">Edit Profile</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
