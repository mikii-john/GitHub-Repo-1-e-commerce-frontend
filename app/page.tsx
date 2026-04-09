'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.slice(0, 4)); // Just show top 4
      } catch (err) {
        console.error('Failed to fetch popular products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <div className="bg-surface font-body text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none font-sans antialiased tracking-tight">
        <div className="flex justify-between items-center px-6 py-3 max-w-full mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-slate-50">CuratorCommerce</span>
            <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-96 group">
              <span className="material-symbols-outlined text-outline text-lg">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline-variant" placeholder="Search curated collections..." type="text"/>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link className="text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 transition-all duration-200" href="#">Shop</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200" href="#">Categories</Link>
            <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200" href="#">Deals</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-full transition-all duration-200">
              <span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
            </button>
            <Link href="/auth" className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-full transition-all duration-200">
              <span className="material-symbols-outlined" data-icon="person">person</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero */}
        <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-xl md:rounded-xl h-[500px] md:h-[600px] flex items-center bg-surface-container-high group">
            <div className="absolute inset-0 z-0">
              <img alt="Luxury store interior" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3_XDFT3ZuporN1sCnTk3axX3G5eQDi2neAIw-B-x1_kC6vvy5ujY6ilQXQ4tlQlRnezyFK8bO_9M4G3aUjugfNgGuVjR0RUgbwYcLMBVQnJifDin5QISJeqEQWVX79rv_CgGiPw70H6bqMhNtV2k4miWm3r15g-jrTBR4uBXGnfa9BmNNYpnwndINEfhGoRVNhx3zGB1ar2XdH111-_GZAHSpd42wmaW9SST0RbbHW9ea3b5W4uZZsaYnzJ04jfJY4q-lno04RG0"/>
              <div className="absolute inset-0 bg-gradient-to-r from-on-background/60 to-transparent"></div>
            </div>
            <div className="relative z-10 px-8 md:px-20 max-w-2xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold tracking-widest uppercase mb-6">
                Summer 2024 Collection
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tighter mb-8">
                The Art of Better Living.
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="primary-gradient text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-primary/20">
                  Shop Now
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all">
                  Browse Categories
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Curation</span>
              <h2 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">Top Categories</h2>
            </div>
            <button className="hidden md:flex items-center gap-2 text-secondary font-medium hover:text-primary transition-colors">
              Explore All Collections
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative rounded-lg overflow-hidden h-[450px] bg-surface-container-low cursor-pointer">
              <img alt="Electronics category" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2JO0neS5LGFh6JorYFqdOdvD804q0LGu7ZZMvpCxS0BlJD2Omrcls95WnGZsJcG1cd51qr0UrDOiIY-ETU7e3skDh3erA0bZpx1fk-89y7JU0LXLNDlFH7b_37FmUAVQgrOm3FjL2cuZD9nwMYRQk5NShUB3qS6MGfgSH2T-R0OtudoCVVsBUIW3N9cagzDUutzIvd_gGwkVty7Q4r02lcpAz_MeWCYyBR2J3rIuZwy82BpKzeTc2Z2EnHPjhDyNtz7RJDsqGnDA"/>
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-bold text-white mb-2">Electronics</h3>
                <p className="text-white/80 text-sm mb-4">Precision engineering meets minimalist aesthetics.</p>
                <span className="text-white font-semibold flex items-center gap-2 text-sm group-hover:translate-x-2 transition-transform">
                  Shop Electronics <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </div>
            <div className="group relative rounded-lg overflow-hidden h-[450px] bg-surface-container-low cursor-pointer">
              <img alt="Fashion category" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe9P6jENJuU9dE_toJqVSwiJOrqeBA7YiJiNnzJneJ7YBQYSWDOOd5Ig04NXCed3NTiZVwcy4GORK9JR2NJB-uQdFxVzv8ULHjmGKBWrFkAR_fJ0Eru98TdgJWh7SdwkeS3TFOAQ6KoCAN_BZu4jNe-Js7JabKs54aS62pZr1yPhbekajvYlBcFG_kgRaL6cTc4TmEx-91Ev32hkJHRONmPqpJKbeIHKx5Ws8OFwbJqAS8quNCIzLVEXccZ2st91Q1epPx2XSahHI"/>
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-bold text-white mb-2">Fashion</h3>
                <p className="text-white/80 text-sm mb-4">Timeless essentials for the modern wardrobe.</p>
                <span className="text-white font-semibold flex items-center gap-2 text-sm group-hover:translate-x-2 transition-transform">
                  Shop Fashion <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </div>
            <div className="group relative rounded-lg overflow-hidden h-[450px] bg-surface-container-low cursor-pointer">
              <img alt="Home category" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoHSWuQ1sotKylLPS3RAfKwuhU844k9O-I-B7mExb4836Ley_aPH0bAKD4s6EdXVEUBnzxAXspSBKG41j-G_WHU3AA9EG5kFwqZ9CmFIjgrrwZyUnJhT5uvAaqMBnelYqbxJsM29TsEi_uxqgy6dY6ex6TDqnM0ev1aZvseIb4dn7S909leT4HdIbqZycKcBNp-F7g8LB9i8sBeSlmsNkFAhzdFDkabo9osTmgiNEcujlphVNRQll2GjeWxXUAatCXIaD0ZR6PQpk"/>
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-bold text-white mb-2">Home</h3>
                <p className="text-white/80 text-sm mb-4">Elevated objects for your personal sanctuary.</p>
                <span className="text-white font-semibold flex items-center gap-2 text-sm group-hover:translate-x-2 transition-transform">
                  Shop Home <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Products */}
        <section className="py-16 px-6 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-on-surface tracking-tight">Popular Products</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-surface-container-lowest text-on-surface-variant hover:bg-white transition-all shadow-sm">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="p-2 rounded-full bg-surface-container-lowest text-on-surface-variant hover:bg-white transition-all shadow-sm">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="flex overflow-x-auto gap-8 no-scrollbar pb-8 min-h-[400px]">
              {loading ? (
                <div className="w-full flex flex-col items-center justify-center p-20">
                   <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                   <p className="text-secondary font-medium tracking-tight">Loading curated collection...</p>
                </div>
              ) : products.length > 0 ? (
                products.map((prod, i) => (
                  <div key={prod._id || i} className="flex-none w-[320px] group">
                    <Link href={`/products/${prod._id}`} className="block">
                      <div className="bg-surface-container-lowest rounded-lg p-6 mb-4 transition-all duration-300 group-hover:shadow-[0px_20px_40px_rgba(25,28,29,0.06)] group-hover:-translate-y-1">
                        <div className="relative h-[320px] overflow-hidden rounded-md bg-white mb-6">
                          <img 
                            alt={prod.name} 
                            className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105" 
                            src={prod.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'} 
                          />
                          <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-secondary hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">favorite</span>
                          </button>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold uppercase tracking-widest mb-3`}>
                          {prod.category}
                        </span>
                        <h4 className="text-lg font-semibold text-on-surface mb-1 truncate">{prod.name}</h4>
                        <p className="text-secondary text-sm mb-4 line-clamp-1">{prod.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">${prod.price.toFixed(2)}</span>
                          <button className="p-2 bg-primary rounded-full text-white hover:scale-110 active:scale-95 transition-all">
                            <span className="material-symbols-outlined">add_shopping_cart</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-20 text-secondary">
                  No products available at the moment.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img alt="Our Philosophy" className="rounded-lg shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyoMnn08gDS1l4KUXXRfyHkS8nP3LwFz2CGXshlP5K_ny_7EsuX3RiKjDMyHFRBhhB50AHMgYHlQBgMP4hRBh8YS9-xrRK3iqpAkK_58RegS7nmh2fMwOv0By5r7SZOuTxQeNNMSoADLtikaGrwRQUWGu1OsDVRLaigWGZ8vSnM-hmV8aNQAKMTdMo155Tpe5THibLbPrddogedUYO84CuKgkCQJ_9luA393KBnrwkmp4H6q5OiuTg-V-BT82FwEYLnk-vnD6QAeE"/>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Our Philosophy</span>
              <h2 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-8 leading-tight">Curated with an eye for quality and intent.</h2>
              <p className="text-lg text-secondary leading-relaxed mb-10">
                We don't believe in endless scrolling. We believe in finding exactly what resonates. Every product in our catalog passes a rigorous test of durability, design integrity, and ethical production.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Verified Quality</h4>
                    <p className="text-on-surface-variant text-sm">Every item is checked for perfection.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined">eco</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Sustainably Sourced</h4>
                    <p className="text-on-surface-variant text-sm">Reducing carbon footprints, one order at a time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscribe */}
        <section className="py-24 px-6 bg-on-background text-white rounded-t-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[300px]" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Join the inner circle.</h2>
            <p className="text-white/60 text-lg mb-10">Get early access to limited collections and private sales.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter your email" type="email"/>
              <button className="bg-white text-on-background px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-8">By subscribing, you agree to our Terms and Privacy Policy.</p>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container px-6 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold tracking-tighter text-on-surface block mb-6">CuratorCommerce</span>
            <p className="text-secondary text-sm leading-relaxed mb-6">Redefining the digital shopping experience through intentional design and premium curation.</p>
            <div className="flex gap-4">
              <a className="text-secondary hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="text-secondary hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-6 uppercase text-xs tracking-widest">Shop</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" href="#">All Products</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Featured</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">New Arrivals</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Discounts</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" href="#">Help Center</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Shipping Info</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Returns</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" href="#">About Us</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Our Process</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Journal</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-outline">
          <p>© 2024 CuratorCommerce. All rights reserved.</p>
          <div className="flex gap-8">
            <Link className="hover:text-primary" href="#">Privacy Policy</Link>
            <Link className="hover:text-primary" href="#">Terms of Service</Link>
            <Link className="hover:text-primary" href="#">Cookie Settings</Link>
          </div>
        </div>
      </footer>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 flex justify-around items-center px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-secondary">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-[10px] font-bold">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-secondary">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-[10px] font-bold">Cart</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-secondary">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Account</span>
        </button>
      </div>
    </div>
  );
}
