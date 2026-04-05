'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  LayoutDashboard,
  Package2,
  Archive,
  Users,
  LineChart,
  Settings,
  Wallet,
  Hourglass,
  Download,
  Plus,
  Receipt,
  Truck,
  Edit3,
  Trash2,
  MoreHorizontal,
  MessageCircle,
  BookOpen,
  X,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';
import { mockProducts, mockOrders } from '@/lib/mockData';

/* ─────────────────────────────── Types ──────────────────────────────── */
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  imageUrl?: string;
}

interface Order {
  _id: string;
  buyer_id: string;
  product_id: any;
  total_amount: number;
  quantity: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_status: 'Unpaid' | 'Held' | 'Released' | 'Refunded';
  createdAt: string;
}

/* ──────────────────────────── Sidebar Link ────────────────────────────── */
const SidebarLink = ({
  icon: Icon,
  label,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) => (
  <Link
    href="#"
    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all hover:scale-[1.02] ${
      active
        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
        : 'text-slate-500 hover:bg-slate-100 border-l-4 border-transparent'
    }`}
  >
    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : ''}`} />
    {label}
  </Link>
);

/* ─────────────────── Status Badge ─────────────────── */
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Paid: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-purple-100 text-purple-800',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span
      className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
        map[status] ?? 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  );
};

/* ────────────────────────────── Bar Chart ─────────────────────────────── */
const barHeights = [48, 64, 40, 80, 96, 56, 112, 128];
const MiniBarChart = () => (
  <div className="absolute bottom-0 left-0 w-full h-24 flex items-end gap-1 px-4 opacity-50">
    {barHeights.map((h, i) => (
      <div
        key={i}
        style={{ height: h }}
        className={`flex-1 rounded-t-sm ${
          i === barHeights.length - 1 ? 'bg-blue-600' : 'bg-blue-200'
        }`}
      />
    ))}
  </div>
);

/* ══════════════════════ Main Component ══════════════════════ */
export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [shippingId, setShippingId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    imageUrl: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders'),
        ]);
        setProducts(prodRes.data?.length ? prodRes.data : (mockProducts as any));
        setOrders(orderRes.data?.length ? orderRes.data : (mockOrders as any));
      } catch {
        setProducts(mockProducts as any);
        setOrders(mockOrders as any);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      _id: Math.random().toString(36).slice(2),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      imageUrl: newProduct.imageUrl || undefined,
    };
    setProducts([product, ...products]);
    setShowAddModal(false);
    setNewProduct({ name: '', price: '', description: '', category: '', stock: '', imageUrl: '' });
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm('Delete this product?')) return;
    setProducts(products.filter((p) => p._id !== id));
  };

  const handleShipOrder = (orderId: string) => {
    setShippingId(orderId);
    setTimeout(() => {
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: 'Shipped' } : o)));
      setShippingId(null);
    }, 1200);
  };

  /* Derived stats */
  const availableBalance = orders
    .filter((o) => o.payment_status === 'Released')
    .reduce((a, c) => a + c.total_amount, 0);
  const pendingBalance = orders
    .filter((o) => o.payment_status === 'Held')
    .reduce((a, c) => a + c.total_amount, 0);

  /* Buyer initials map */
  const buyerInitials: Record<string, string> = {
    u1: 'AU', u2: 'SU', u3: 'BU', u4: 'SS',
  };
  const buyerNames: Record<string, string> = {
    u1: 'Admin User', u2: 'Seller User', u3: 'Buyer User', u4: 'Staff',
  };
  const avatarColors = ['bg-purple-100 text-purple-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700'];

  return (
    <ProtectedRoute roles={['seller']}>
      <div className="flex min-h-screen bg-[#f8f9fa] text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* ────────────── Sidebar ────────────── */}
        <aside className="w-64 fixed left-0 top-0 h-screen bg-slate-50 flex flex-col py-6 px-4 z-40 border-r border-slate-200">
          <div className="mb-10 px-2">
            <h1 className="text-lg font-black text-slate-900">Management Console</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-0.5">
              Seller Portal
            </p>
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarLink icon={LayoutDashboard} label="Dashboard" active />
            <SidebarLink icon={Package2} label="Orders" />
            <SidebarLink icon={Archive} label="Inventory" />
            <SidebarLink icon={Users} label="Customers" />
            <SidebarLink icon={LineChart} label="Analytics" />
            <SidebarLink icon={Settings} label="Settings" />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                AC
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Alex Curator</span>
                <span className="text-[10px] text-slate-500">Premium Seller</span>
              </div>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover:scale-[1.02] active:opacity-80 shadow-lg shadow-blue-600/20">
              View Storefront
            </button>
          </div>
        </aside>

        {/* ────────────── Main ────────────── */}
        <main className="ml-64 flex-1 p-8 min-h-screen">

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
              <p className="text-slate-500 text-sm mt-1">
                Welcome back, Alex. Your store is performing{' '}
                <span className="text-green-600 font-semibold">12% better</span> this week.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:scale-105 transition-transform flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-3 bg-gradient-to-br from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </motion.header>

          {/* ── Bento Stats Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {/* Available Balance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Wallet className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  +4.5%
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Available Balance</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                ${(availableBalance || 12450.80).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider font-bold">
                Ready for payout
              </p>
            </motion.div>

            {/* Pending Balance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                  <Hourglass className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  Escrow
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Pending Balance</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
                ${(pendingBalance || 4210.00).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider font-bold">
                Release in 3–7 days
              </p>
            </motion.div>

            {/* Monthly Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="md:col-span-2 bg-slate-100 p-6 rounded-2xl overflow-hidden relative min-h-[140px]"
            >
              <div className="relative z-10">
                <p className="text-slate-500 text-sm font-medium">Monthly Growth</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">78% Rate</h3>
              </div>
              <MiniBarChart />
            </motion.div>
          </div>

          {/* ── Orders & Inventory ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Recent Orders — 2/3 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">Recent Orders</h3>
                <Link href="#" className="text-blue-600 text-sm font-semibold hover:underline">
                  View All Orders
                </Link>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['Order ID', 'Customer', 'Status', 'Actions'].map((h, i) => (
                        <th
                          key={h}
                          className={`px-6 py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest ${
                            i === 3 ? 'text-right' : ''
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      [1, 2, 3].map((i) => (
                        <tr key={i}>
                          <td colSpan={4} className="px-6 py-4">
                            <div className="h-6 bg-slate-100 animate-pulse rounded-lg" />
                          </td>
                        </tr>
                      ))
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center text-slate-400 italic text-sm">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, idx) => (
                        <tr
                          key={order._id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-sm text-slate-700">
                            #ORD-{order._id.slice(-4).toUpperCase()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                  avatarColors[idx % avatarColors.length]
                                }`}
                              >
                                {buyerInitials[order.buyer_id] ?? 'BU'}
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                                {buyerNames[order.buyer_id] ?? 'Customer'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            {order.status === 'Paid' ? (
                              <button
                                onClick={() => handleShipOrder(order._id)}
                                disabled={shippingId === order._id}
                                className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-1.5 ml-auto"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                {shippingId === order._id ? 'Marking…' : 'Mark Shipped'}
                              </button>
                            ) : order.status === 'Delivered' ? (
                              <div className="flex items-center gap-1 justify-end text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-bold">Funds Released</span>
                              </div>
                            ) : (
                              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors ml-auto flex">
                                <Receipt className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Top Inventory — 1/3 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">Top Inventory</h3>
                <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3">
                {loading
                  ? [1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
                    ))
                  : products.slice(0, 3).map((product) => (
                      <div
                        key={product._id}
                        className="bg-white p-4 rounded-2xl flex items-center gap-4 group hover:shadow-lg hover:shadow-slate-200/60 transition-all border border-slate-200/80"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package2 className="w-7 h-7 text-slate-300" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{product.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Stock: {String(product.stock).padStart(2, '0')} units
                          </p>
                          <div className="flex gap-3 mt-2">
                            <button className="text-[10px] font-bold text-blue-600 uppercase hover:tracking-widest transition-all">
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-[10px] font-bold text-red-500 uppercase hover:tracking-widest transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-bold text-slate-900">${product.price}</span>
                        </div>
                      </div>
                    ))}
              </div>
            </motion.div>
          </div>

          {/* ── Help Footer ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-12 p-8 rounded-2xl bg-slate-200/60 relative overflow-hidden border border-slate-200/80"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Need help with your listings?</h4>
                <p className="text-slate-500 text-sm mt-1 max-w-md">
                  Our curator support team is available 24/7 to help you optimize your store conversion rates.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-sm hover:scale-105 transition-transform active:opacity-90 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat with Expert
                </button>
                <button className="px-8 py-4 bg-white text-slate-700 rounded-full font-bold text-sm border border-slate-200 hover:scale-105 transition-transform flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Read Seller Guide
                </button>
              </div>
            </div>
            {/* Abstract background blob */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          </motion.section>
        </main>

        {/* ────────────── Add Product Modal ────────────── */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
              onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto border border-slate-200"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900">Add New Product</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-5">
                  {[
                    { label: 'Product Name', key: 'name', type: 'text', placeholder: 'Vanguard Watch Pro' },
                    { label: 'Image URL (optional)', key: 'imageUrl', type: 'url', placeholder: 'https://…' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={(newProduct as any)[key]}
                        onChange={(e) => setNewProduct({ ...newProduct, [key]: e.target.value })}
                        required={key === 'name'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-sm transition-all"
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Price ($)</label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        placeholder="249.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-sm transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Stock Units</label>
                      <input
                        required
                        type="number"
                        placeholder="50"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
                    <input
                      required
                      type="text"
                      placeholder="Electronics, Fashion, Accessories…"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your product's key features and benefits…"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-sm resize-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                  >
                    Publish Product
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
