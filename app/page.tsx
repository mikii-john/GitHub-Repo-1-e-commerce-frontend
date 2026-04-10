'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollActive, setScrollActive] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollActive(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const fetchPopular = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.slice(0, 8)); // Show more for carousel
      } catch (err) {
        console.error('Failed to fetch popular products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-surface font-sans text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrollActive ? 'bg-slate-950/90 backdrop-blur-xl shadow-2xl py-2 border-b border-white/5' : 'bg-slate-900/40 backdrop-blur-md py-6 border-b border-white/5'}`}>
        <div className="flex justify-between items-center px-6 md:px-12 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-12">
            <Link href="/" className="group flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined font-bold">shopping_bag</span>
              </div>
              <span className="text-2xl font-black tracking-tighter transition-colors text-white">Adare Shop</span>
            </Link>
            <div className="hidden lg:flex items-center bg-white/10 dark:bg-slate-800/20 backdrop-blur-md px-4 py-2 rounded-full border border-slate-300/50 dark:border-slate-700/50 w-[400px] group transition-all focus-within:w-[500px] focus-within:shadow-xl">
              <span className="material-symbols-outlined text-slate-500 dark:text-slate-300 text-lg">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-500 dark:placeholder:text-slate-300 placeholder:font-medium ml-2 text-slate-900 dark:text-white" placeholder="Search premium collections..." type="text"/>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-bold border-b-2 border-primary text-primary tracking-wide" href="/">Home</Link>
            <Link className="text-sm font-bold text-white/90 hover:text-white transition-all tracking-wide" href="/products">Products</Link>
            <Link className="text-sm font-bold text-white/90 hover:text-white transition-all tracking-wide" href="#categories">Categories</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/cart" className="relative p-2.5 text-white/80 hover:bg-white/10 rounded-full transition-all group">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform" data-icon="shopping_cart">shopping_cart</span>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard" className="flex items-center gap-3 pl-4 border-l border-white/10 group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-all">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">Welcome back</p>
                  <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
                </div>
              </Link>
            ) : (
              <Link href="/auth" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 tracking-wide">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Modern Premium Hero */}
        <section className="relative min-h-[90vh] flex items-center pt-32 lg:pt-40 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent z-0"></div>
          <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/2 -left-24 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="relative z-10 px-6 md:px-12 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">

              <h1 className="text-6xl md:text-8xl font-black text-slate-950 dark:text-white leading-[0.9] tracking-tighter mb-8 italic drop-shadow-sm">
                CRAFTED FOR <br/>
                <span className="text-gradient">EXCELLENCE.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-950 dark:text-white mb-12 max-w-2xl leading-relaxed font-bold drop-shadow-sm">
                Experience a new standard of digital commerce. Curated high-end products, secured by escrow, delivered with intent.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/products" className="group bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl shadow-slate-900/20 hover:shadow-primary/30 hover:bg-primary dark:hover:bg-primary dark:hover:text-white hover:-translate-y-2">
                  Shop Collection
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_forward</span>
                </Link>
                <Link href="#categories" className="group glass-dark lg:glass bg-white/50 dark:bg-transparent px-10 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-4 transition-all duration-500 border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white hover:-translate-y-2 hover:bg-white text-center">
                  Browse Categories
                  <span className="material-symbols-outlined transition-transform group-hover:rotate-12">grid_view</span>
                </Link>
              </div>
              

            </div>

            <div className="relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative z-10 w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] group">
                <img 
                  alt="Luxury Product Hero" 
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2599"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-80"></div>
                
                {/* Floating Glass Cards */}
                <div className="absolute bottom-10 left-10 right-10 glass-dark p-6 rounded-3xl animate-float">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Special Edition</p>
                      <h4 className="text-xl font-bold text-white">Classic Minimalist Watch</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">Birr 249.00</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-10 left-10 glass-dark p-4 rounded-2xl animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-lg text-white">
                      <span className="material-symbols-outlined">verified</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white/80 uppercase tracking-widest leading-none">Authentication</p>
                      <p className="text-sm font-bold text-white">100% Guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Back elements */}
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500 rounded-3xl -z-10 rotate-12 opacity-20"></div>
              <div className="absolute -top-10 -right-10 w-64 h-64 border-2 border-slate-200 rounded-full -z-10 animate-spin-slow"></div>
            </div>
          </div>
        </section>

        {/* Categories - Grid Overhaul */}
        <section id="categories" className="relative py-32 px-6 md:px-12 max-w-[1600px] mx-auto scroll-mt-24">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 relative z-10">
            <div className="max-w-2xl">
              <span className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-6 block">Curated Collections</span>
              <h2 className="text-6xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter leading-[0.9] italic">
                BROWSE BY <br/>
                <span className="text-gradient">ESSENCE.</span>
              </h2>
            </div>
            <Link href="/products" className="group flex items-center gap-4 text-lg font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-8 py-4 rounded-2xl hover:bg-primary hover:text-white transition-all">
              Explore All Styles
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[800px] md:h-[600px]">
             {[
               { id: 'electronics', title: 'Electronics', img: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2670', span: 'md:col-span-2' },
               { id: 'shoes', title: 'Footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2670', span: 'md:col-span-1' },
               { id: 'cloth', title: 'Apparel', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2670', span: 'md:col-span-1' },
               { id: 'home material', title: 'Living', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2670', span: 'md:col-span-4' }
             ].map((cat, idx) => (
                <Link key={idx} href={`/products?category=${cat.id}`} className={`${cat.span} group relative rounded-[2.5rem] overflow-hidden cursor-pointer block h-full shadow-lg hover:shadow-2xl transition-all duration-500`}>
                  <img alt={cat.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src={cat.img}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-10 left-10 right-10 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.3em] mb-2 text-white/80">Collection</p>
                    <h3 className="text-4xl font-black italic tracking-tighter mb-4 text-white drop-shadow-md">{cat.title}</h3>
                    <div className="flex items-center gap-3 font-bold text-sm bg-slate-900/40 backdrop-blur-md w-fit px-6 py-3 rounded-xl border border-white/20 group-hover:bg-primary transition-all group-hover:translate-x-2">
                       Enter Store <span className="material-symbols-outlined text-sm">north_east</span>
                    </div>
                  </div>
                </Link>
             ))}
          </div>
        </section>

        {/* Popular Products - Carousel Refinement */}
        <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <span className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-6 block">Trending Now</span>
                <h2 className="text-6xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tighter leading-[0.9] italic">MOST COVETED.</h2>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => scrollCarousel('left')}
                  className="w-16 h-16 rounded-full glass border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white hover:bg-primary hover:text-white transition-all group shadow-sm active:scale-90"
                >
                  <span className="material-symbols-outlined font-black transition-transform group-hover:-translate-x-1">west</span>
                </button>
                <button 
                  onClick={() => scrollCarousel('right')}
                  className="w-16 h-16 rounded-full glass border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white hover:bg-primary hover:text-white transition-all group shadow-sm active:scale-90"
                >
                  <span className="material-symbols-outlined font-black transition-transform group-hover:translate-x-1">east</span>
                </button>
              </div>
            </div>
            
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto gap-8 no-scrollbar pb-12 snap-x snap-mandatory"
            >
              {loading ? (
                <div className="w-full flex flex-col items-center justify-center p-20">
                   <div className="w-16 h-16 border-8 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                   <p className="text-slate-600 dark:text-slate-200 font-bold tracking-[0.2em] uppercase text-sm">Refining results...</p>
                </div>
              ) : products.length > 0 ? (
                products.map((prod, i) => (
                  <div key={prod._id || i} className="flex-none w-[350px] md:w-[420px] snap-start group">
                    <Link href={`/products/${prod._id}`} className="block">
                      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 mb-4 transition-all duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group-hover:-translate-y-4 border border-transparent hover:border-primary/20">
                        <div className="relative h-[400px] overflow-hidden rounded-[2rem] bg-slate-50 dark:bg-slate-700/50 mb-8">
                          <img 
                            alt={prod.name} 
                            className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-110" 
                            src={prod.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'} 
                          />
                          <button 
                            onClick={(e) => { e.preventDefault(); /* Favorite logic */ }}
                            className="absolute top-6 right-6 w-12 h-12 glass backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                          >
                            <span className="material-symbols-outlined text-2xl">favorite</span>
                          </button>
                          <div className="absolute bottom-6 left-6">
                            <span className="px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em]">
                              {prod.category}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-2xl font-black text-slate-950 dark:text-white mb-2 truncate italic">{prod.name}</h4>
                        <p className="text-slate-600 dark:text-slate-300 font-medium mb-8 line-clamp-1">{prod.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-black text-primary tracking-tighter">Birr {prod.price?.toFixed(2)}</span>
                          <button 
                            onClick={(e) => { e.preventDefault(); /* Add to cart logic */ }}
                            className="w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all transform group-hover:rotate-12"
                          >
                            <span className="material-symbols-outlined">add_shopping_cart</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-32 text-slate-400 font-bold uppercase tracking-widest">
                  Nothing to show right now.
                </div>
              )}
            </div>
          </div>
        </section>


      </main>

      {/* Footer - Premium Overhaul */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white px-6 md:px-12 py-32 rounded-t-[4rem]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
            <div className="col-span-1 md:col-span-1">
              <span className="text-3xl font-black tracking-tighter block mb-8">Adare Shop</span>
              <p className="text-slate-300 font-medium leading-relaxed mb-10 max-w-xs">Redefining digital acquisition through curated luxury and absolute trust.</p>
              <div className="flex gap-4">
                {['facebook', 'instagram', 'twitter'].map(social => (
                  <a key={social} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all group" href="#">
                    <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">{social === 'twitter' ? 'X' : social}</span>
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Shop', links: ['All Products', 'Featured', 'New Arrivals', 'Discounts'] },
              { title: 'Support', links: ['Help Center', 'Shipping Info', 'Returns', 'Track Order'] },
              { title: 'Essence', links: ['About Us', 'Our Process', 'Journal', 'Careers'] }
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-10 text-slate-400">{section.title}</h4>
                <ul className="space-y-6">
                  {section.links.map(link => (
                    <li key={link}>
                      <Link className="text-lg font-bold text-slate-300 hover:text-white transition-all hover:translate-x-2 inline-block" href="#">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">© 2024 Adare Shop. Engineered with excellence.</p>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link className="hover:text-white transition-all" href="#">Privacy</Link>
              <Link className="hover:text-white transition-all" href="#">Terms</Link>
              <Link className="hover:text-white transition-all" href="#">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Nav - Consistency Fix */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 h-20 glass-dark rounded-3xl z-50 flex justify-around items-center px-6 shadow-2xl">
        {[
          { icon: 'home', label: 'Home', href: '/' },
          { icon: 'grid_view', label: 'Explore', href: '/products' },
          { icon: 'shopping_cart', label: 'Cart', href: '/cart' },
          { icon: user ? 'person' : 'login', label: user ? 'Account' : 'Sign In', href: user ? '/dashboard' : '/auth' }
        ].map((item, idx) => (
          <Link key={idx} href={item.href} className="flex flex-col items-center gap-1 text-white">
            <span className={`material-symbols-outlined ${item.href === '/' ? 'text-primary' : ''}`}>{item.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
