'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Order {
  _id: string;
  product_id: {
    name: string;
    price: number;
  };
  total_amount: number;
  quantity: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_status: 'Unpaid' | 'Held' | 'Released' | 'Refunded';
  tracking_number?: string;
  createdAt: string;
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/buyer');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (orderId: string) => {
    setConfirming(orderId);
    try {
      await api.put(`/orders/${orderId}/confirm-delivery`);
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'Delivered', payment_status: 'Released' } 
          : order
      ));
    } catch (error) {
      console.error('Error confirming delivery', error);
      alert('Failed to confirm delivery. Please try again.');
    } finally {
      setConfirming(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Paid': return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      case 'Shipped': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <AlertCircle className="w-4 h-4 text-muted" />;
    }
  };

  return (
    <ProtectedRoute roles={['buyer']}>
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="mb-12">
            <h1 className="text-4xl font-black mb-2">Buyer Dashboard</h1>
            <p className="text-muted">Manage your purchases, track shipments, and confirm deliveries.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="p-8 bg-card border border-border rounded-3xl flex items-center gap-6">
               <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <Package className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Total Orders</h3>
                  <p className="text-3xl font-black">{orders.length}</p>
               </div>
            </div>
            <div className="p-8 bg-card border border-border rounded-3xl flex items-center gap-6">
               <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
                  <Clock className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Active Shipments</h3>
                  <p className="text-3xl font-black">{orders.filter(o => o.status === 'Shipped').length}</p>
               </div>
            </div>
            <div className="p-8 bg-card border border-border rounded-3xl flex items-center gap-6">
               <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7" />
               </div>
               <div>
                  <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Completed</h3>
                  <p className="text-3xl font-black">{orders.filter(o => o.status === 'Delivered').length}</p>
               </div>
            </div>
          </div>

          <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
             Recent Orders <ArrowRight className="w-6 h-6 text-primary" />
          </h2>

          <div className="space-y-6">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-40 bg-card rounded-3xl animate-pulse border border-border"></div>
              ))
            ) : orders.length === 0 ? (
              <div className="p-20 text-center bg-card rounded-3xl border border-dashed border-border flex flex-col items-center">
                <Package className="w-16 h-16 text-muted mb-4 opacity-30" />
                <h3 className="text-xl font-bold mb-2">No orders found</h3>
                <p className="text-muted mb-8">You haven't placed any orders yet.</p>
                <Link href="/" className="px-8 py-3 bg-primary text-white rounded-xl font-bold">
                   Go Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={order._id} 
                  className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all"
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                         <Package className="w-10 h-10 text-muted" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-muted uppercase tracking-widest">Order ID: #{order._id.slice(-6)}</span>
                          <span className="text-xs text-muted">•</span>
                          <span className="text-xs text-muted font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-xl font-black mb-1">{order.product_id?.name || 'Unknown Product'}</h3>
                        <p className="text-sm text-muted">Quantity: {order.quantity} • Total: <span className="font-bold text-foreground">${order.total_amount.toFixed(2)}</span></p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-6 px-6 py-4 bg-background/50 rounded-2xl border border-border">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Status</span>
                           <div className="flex items-center gap-2 font-bold text-sm">
                             {getStatusIcon(order.status)}
                             {order.status}
                           </div>
                        </div>
                        
                        <div className="h-8 w-px bg-border"></div>
                        
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Payment</span>
                           <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                             order.payment_status === 'Released' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 
                             order.payment_status === 'Held' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 
                             'bg-slate-100 text-slate-700 dark:bg-slate-800'
                           }`}>
                             {order.payment_status}
                           </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                         {order.status === 'Shipped' && (
                           <button 
                             onClick={() => handleConfirmDelivery(order._id)}
                             disabled={confirming === order._id}
                             className="px-6 py-4 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center gap-2 disabled:opacity-50"
                           >
                              {confirming === order._id ? 'Confirming...' : (
                                <>
                                  <CheckCircle className="w-5 h-5" /> Confirm Delivery
                                </>
                              )}
                           </button>
                         )}
                         
                         {order.tracking_number && (
                           <div className="px-6 py-4 bg-card border border-border rounded-2xl text-sm font-bold flex flex-col">
                              <span className="text-[10px] text-muted uppercase mb-1">Tracking Number</span>
                              <span className="flex items-center gap-2">
                                {order.tracking_number} <ExternalLink className="w-3 h-3 text-primary" />
                              </span>
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar for shipped orders */}
                  {order.status === 'Shipped' && (
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        className="h-full bg-primary"
                      ></motion.div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

import Link from 'next/link';
