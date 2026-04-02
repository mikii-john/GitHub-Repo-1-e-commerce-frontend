'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  Package, 
  Trash2, 
  Plus, 
  Search, 
  Edit3, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck,
  Truck,
  CheckCircle,
  X,
  PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  countInStock: number;
}

interface Order {
  _id: string;
  product_id: {
    name: string;
    price: number;
  };
  total_amount: number;
  quantity: number;
  status: string;
  payment_status: string;
  createdAt: string;
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    countInStock: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products/myproducts'),
        api.get('/orders/seller')
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching seller data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/products', newProduct);
      setProducts([data, ...products]);
      setShowAddModal(false);
      setNewProduct({ name: '', price: '', description: '', category: '', countInStock: '' });
    } catch (error) {
      console.error('Error adding product', error);
      alert('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const handleShipOrder = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/ship`);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'Shipped' } : o));
    } catch (error) {
      console.error('Error shipping order', error);
    }
  };

  const totalEarnings = orders
    .filter(o => o.payment_status === 'Released')
    .reduce((acc, current) => acc + current.total_amount, 0);

  return (
    <ProtectedRoute roles={['seller']}>
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="text-4xl font-black mb-2">Seller Dashboard</h1>
              <p className="text-muted">Manage your inventory, track sales, and handle orders.</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95"
            >
              <PlusCircle className="w-6 h-6" /> Add New Product
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="p-8 bg-card border border-border rounded-3xl">
               <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Package className="w-6 h-6" />
               </div>
               <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Products</h3>
               <p className="text-3xl font-black">{products.length}</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-3xl">
               <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
               </div>
               <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Total Sales</h3>
               <p className="text-3xl font-black">{orders.length}</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-3xl">
               <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                  <DollarSign className="w-6 h-6" />
               </div>
               <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Total Earnings</h3>
               <p className="text-3xl font-black">${totalEarnings.toFixed(2)}</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-3xl">
               <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Escrow Held</h3>
               <p className="text-3xl font-black">${orders.filter(o => o.payment_status === 'Held').reduce((a,c)=>a+c.total_amount, 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Products List */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black">My Inventory</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input type="text" placeholder="Search inventory..." className="pl-10 pr-4 py-2 bg-card border border-border rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div className="space-y-4">
                {loading ? (
                  [1,2,3].map(i => <div key={i} className="h-24 bg-card animate-pulse rounded-3xl border border-border"></div>)
                ) : products.length === 0 ? (
                  <div className="p-20 text-center bg-card rounded-3xl border border-dashed border-border">
                    <p className="text-muted">No products yet.</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <motion.div 
                      key={product._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 bg-card border border-border rounded-3xl flex items-center justify-between hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                           <Package className="w-8 h-8 text-muted" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{product.name}</h4>
                          <span className="text-xs font-bold text-muted uppercase tracking-widest">{product.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
                          <p className="text-[10px] font-black text-primary uppercase">{product.countInStock} In Stock</p>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-3 text-muted hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all">
                              <Edit3 className="w-5 h-5" />
                           </button>
                           <button 
                             onClick={() => handleDeleteProduct(product._id)}
                             className="p-3 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-2">
               <h2 className="text-2xl font-black mb-8">Recent Sales</h2>
               <div className="space-y-4">
                  {loading ? (
                    [1,2].map(i => <div key={i} className="h-40 bg-card border border-border animate-pulse rounded-3xl"></div>)
                  ) : orders.length === 0 ? (
                    <div className="p-20 text-center bg-card rounded-3xl border border-dashed border-border">
                      <p className="text-muted">No sales yet.</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <motion.div 
                        key={order._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 bg-card border border-border rounded-3xl space-y-4"
                      >
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-muted uppercase tracking-widest">Order #{order._id.slice(-6)}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              order.status === 'Paid' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                              order.status === 'Shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' :
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                              'bg-slate-100 text-slate-700 dark:bg-slate-800'
                            }`}>{order.status}</span>
                         </div>
                         
                         <div>
                            <h4 className="font-bold line-clamp-1">{order.product_id?.name || 'Deleted Product'}</h4>
                            <p className="text-xs text-muted">Quantity: {order.quantity} • Total: <span className="font-bold text-foreground">${order.total_amount.toFixed(2)}</span></p>
                         </div>

                         {order.status === 'Paid' && (
                           <button 
                             onClick={() => handleShipOrder(order._id)}
                             className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-all"
                           >
                              <Truck className="w-4 h-4" /> Mark as Shipped
                           </button>
                         )}

                         {order.status === 'Shipped' && (
                            <div className="flex items-center gap-2 justify-center py-3 text-xs font-bold text-purple-500 bg-purple-500/10 rounded-xl">
                               <Package className="w-4 h-4" /> Waiting for Buyer Confirmation
                            </div>
                         )}

                         {order.status === 'Delivered' && (
                            <div className="flex items-center gap-2 justify-center py-3 text-xs font-bold text-green-500 bg-green-500/10 rounded-xl">
                               <CheckCircle className="w-4 h-4" /> Funds Released
                            </div>
                         )}
                      </motion.div>
                    ))
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
              >
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black">Add New Product</h2>
                    <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-background rounded-full transition-colors text-muted">
                       <X className="w-6 h-6" />
                    </button>
                 </div>

                 <form onSubmit={handleAddProduct} className="space-y-6">
                    <div className="space-y-1.5">
                       <label className="text-xs font-bold uppercase tracking-wider text-muted">Product Name</label>
                       <input 
                         required 
                         type="text" 
                         value={newProduct.name}
                         onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                         placeholder="Premium Leather Jacket" 
                         className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted">Price ($)</label>
                          <input 
                            required 
                            type="number" 
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            placeholder="99.99" 
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted">Stock Quantity</label>
                          <input 
                            required 
                            type="number"
                            value={newProduct.countInStock}
                            onChange={(e) => setNewProduct({...newProduct, countInStock: e.target.value})}
                            placeholder="50" 
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
                          />
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-xs font-bold uppercase tracking-wider text-muted">Category</label>
                       <input 
                         required 
                         type="text"
                         value={newProduct.category}
                         onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                         placeholder="Fashion, Electronics, etc." 
                         className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
                       />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-xs font-bold uppercase tracking-wider text-muted">Description</label>
                       <textarea 
                         required 
                         rows={4}
                         value={newProduct.description}
                         onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                         placeholder="Describe your product excellence..." 
                         className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                       ></textarea>
                    </div>

                    <button type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95">
                       Publish Product
                    </button>
                 </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </ProtectedRoute>
  );
}
