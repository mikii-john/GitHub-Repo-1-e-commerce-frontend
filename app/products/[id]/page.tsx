'use client';

import React, { useEffect, useState, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  ChevronLeft, 
  Plus, 
  Minus, 
  Zap,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  countInStock: number;
  seller_id?: string;
}

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product', err);
        setError('Failed to load product. It might have been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuy = async () => {
    if (!isAuthenticated) {
      window.location.href = `/auth?redirect=/products/${id}`;
      return;
    }

    setBuying(true);
    try {
      // 1. Create order
      const { data: orderData } = await api.post('/orders', {
        product_id: product?._id,
        seller_id: product?.seller_id,
        quantity,
      });

      // 2. Initialize payment with Chapa
      const { data: paymentData } = await api.post('/payments/initialize', {
        order_id: orderData._id,
      });

      // 3. Redirect to Chapa
      if (paymentData.checkout_url) {
        window.location.href = paymentData.checkout_url;
      } else {
        throw new Error('Payment initialization failed');
      }
    } catch (err: any) {
      console.error('Payment error', err);
      setError(err.response?.data?.message || 'Failed to initialize payment.');
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-black mb-2">Oops!</h2>
          <p className="text-muted mb-8 text-center max-w-sm">{error}</p>
          <Link href="/" className="px-8 py-3 bg-primary text-white rounded-xl font-bold">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-primary mb-10 transition-colors font-medium">
          <ChevronLeft className="w-5 h-5" /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Images Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-[4/5] bg-card border border-border rounded-3xl overflow-hidden relative group">
              <div className="absolute inset-0 flex items-center justify-center text-muted">
                 <ShoppingBag className="w-40 h-40 opacity-5 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 p-6 glass rounded-2xl flex items-center justify-between">
                <div>
                   <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Authentic Gear</h4>
                   <p className="text-lg font-bold">Premium Quality {product.category}</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                   <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-card border border-border rounded-xl cursor-pointer hover:border-primary transition-colors"></div>
              ))}
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-6">
              <Zap className="w-3.5 h-3.5 fill-current" /> Fast Seller
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
              <div className="flex flex-col">
                <span className="text-sm text-muted font-medium mb-1">Price</span>
                <span className="text-4xl font-black text-foreground">$ {product.price.toFixed(2)}</span>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="text-sm text-muted font-medium mb-1">Escrow Fee</span>
                <span className="text-lg font-bold text-green-500">Free</span>
              </div>
            </div>

            <p className="text-muted leading-relaxed mb-10 text-lg">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-10">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted mb-4">Select Quantity</h4>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-card border border-border rounded-xl p-1 w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:text-primary transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.countInStock || 99, quantity + 1))}
                    className="p-3 hover:text-primary transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm font-medium text-muted">
                  {product.countInStock > 0 ? `${product.countInStock} items remaining` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 mb-10">
              <button 
                onClick={handleBuy}
                disabled={buying || product.countInStock <= 0}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {buying ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Secure Purchase <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-6 py-4 px-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-border">
                <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
                   <ShieldCheck className="w-4 h-4 text-green-500" /> Escrow Protection
                </div>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase">
                   <Truck className="w-4 h-4 text-blue-500" /> Fast Shipping
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 bg-card border border-border rounded-2xl">
                 <h5 className="font-bold mb-2">Safe Trading</h5>
                 <p className="text-xs text-muted leading-relaxed">
                   Your payment is held securely in escrow. The seller only receives the funds after you confirm delivery.
                 </p>
              </div>
              <div className="p-6 bg-card border border-border rounded-2xl">
                 <h5 className="font-bold mb-2">Fast Resolution</h5>
                 <p className="text-xs text-muted leading-relaxed">
                   Issues with your order? Open a dispute instantly and our support staff will help you resolve it.
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
