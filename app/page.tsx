'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/products/ProductCard';
import api from '@/lib/api';
import { ShoppingBag, ChevronRight, Zap, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),rgba(2,6,23,1))]"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 bg-gradient-to-l from-primary/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-xs font-bold uppercase tracking-wider mb-6">
                <Zap className="w-4 h-4 fill-current" /> Fast & Secure Escrow Payments
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Shop with <span className="text-gradient">Confidence.</span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
                Discover premium products with our state-of-the-art escrow system. Your money is only released when you're happy.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-primary rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95 flex items-center gap-2 group">
                  Explore Products <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold`}>
                        {i}
                      </div>
                    ))}
                  </div>
                  <span>Trusted by 10k+ users</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="hidden md:flex justify-center relative"
            >
              <div className="w-80 h-96 bg-gradient-to-br from-primary to-accent rounded-3xl rotate-6 absolute top-0 -z-10 blur-2xl opacity-40"></div>
              <div className="w-80 h-96 bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-6 flex flex-col relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -z-1"></div>
                 <div className="w-full aspect-square bg-slate-900 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
                    <ShoppingBag className="w-24 h-24 text-slate-700 group-hover:scale-110 group-hover:text-primary transition-all duration-500" />
                 </div>
                 <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-slate-700 rounded-full"></div>
                    <div className="h-4 w-1/2 bg-slate-700 rounded-full"></div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                      <div className="h-6 w-20 bg-primary/30 rounded-full"></div>
                      <div className="h-10 w-10 bg-slate-700 rounded-lg"></div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Features Row */}
        <div className="absolute bottom-0 inset-x-0 bg-white/5 backdrop-blur-sm border-t border-white/10 hidden md:block">
           <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                 <div className="p-2 rounded-lg bg-primary/10 text-primary"><ShieldCheck className="w-6 h-6" /></div>
                 <div>
                    <h4 className="font-bold">Escrow Protection</h4>
                    <p className="text-xs text-slate-400">Guaranteed secure transactions</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="p-2 rounded-lg bg-accent/10 text-accent"><Truck className="w-6 h-6" /></div>
                 <div>
                    <h4 className="font-bold">Fast Delivery</h4>
                    <p className="text-xs text-slate-400">Doorstep delivery nationwide</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="p-2 rounded-lg bg-secondary/10 text-secondary"><ShoppingBag className="w-6 h-6" /></div>
                 <div>
                    <h4 className="font-bold">Premium Quality</h4>
                    <p className="text-xs text-slate-400">Curated products for you</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">New Arrivals</h2>
            <p className="text-muted text-lg max-w-xl">
              Discover the latest trends and essential products selected just for you.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-border rounded-lg text-sm font-bold hover:bg-card transition-colors">Filters</button>
            <select className="px-6 py-2 border border-border rounded-lg text-sm font-bold bg-transparent outline-none">
              <option>Sort by: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[4/5] bg-card/50 rounded-xl animate-pulse flex flex-col p-4 gap-4">
                <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                <div className="h-8 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <ShoppingBag className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-muted">Stay tuned, new arrivals are coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted text-sm">© 2026 NNM E-commerce Shop. Powered by Chapa Secure Escrow.</p>
        </div>
      </footer>
    </main>
  );
}
