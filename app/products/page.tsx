'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import {
  Search,
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sliders,
  X,
} from 'lucide-react';

// Remove allProducts static list as we'll fetch from API
const CATEGORIES_FALLBACK = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Accessories'];
const SORT_OPTIONS = ['Newest', 'Price: Low-High', 'Price: High-Low', 'Rating'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const ITEMS_PER_PAGE = 9;

// Star renderer
const Stars = ({ count = 5, filled = 4 }: { count?: number; filled?: number }) => (
  <div className="flex text-amber-400">
    {Array.from({ length: count }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < filled ? 'fill-current' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

interface ProductData {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl?: string;
  stock: number;
  seller_id: string;
  badge?: string;
  originalPrice?: number;
}

// ─── Product Card ────────────────────────────────────────────────────────────
const ProductCard = ({ product }: { product: ProductData }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const hasDiscount = !!(product as any).originalPrice;

  return (
    <Link href={`/products/${product._id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0px_20px_60px_rgba(0,74,198,0.10)] hover:-translate-y-1.5 cursor-pointer">
        {/* Image */}
        <div className="relative aspect-[4/5] bg-[#f3f4f5] overflow-hidden">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badge */}
          {(product as any).badge && (
            <span className="absolute top-4 left-4 bg-[#004ac6] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-md">
              {(product as any).badge}
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-[#3e3fcc] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-md">
              Sale&nbsp;-{Math.round((1 - product.price / (product as any).originalPrice!) * 100)}%
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted((w) => !w); }}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 transition-all active:scale-90 shadow-sm hover:shadow-md"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-700'}`}
            />
          </button>

          {/* Out-of-stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="text-[10px] font-bold text-[#737686] uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h3 className="text-base font-bold text-[#191c1d] mb-3 group-hover:text-[#004ac6] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-[#737686] line-through">
                  ${(product as any).originalPrice!.toFixed(2)}
                </span>
              )}
              <span className={`text-xl font-black ${hasDiscount ? 'text-[#004ac6]' : 'text-[#191c1d]'}`}>
                ${product.price.toFixed(2)}
              </span>
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className="bg-gradient-to-br from-[#004ac6] to-[#2563eb] text-white p-3 rounded-full hover:scale-110 transition-transform active:scale-95 flex items-center justify-center shadow-lg shadow-blue-600/20"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ProductListingPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [priceMax, setPriceMax] = useState(2500);
  const [sortBy, setSortBy] = useState<SortOption>('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
        setError('');
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Using fallback data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoriesFromData = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  }, [products]);

  const categories = products.length > 0 ? categoriesFromData : CATEGORIES_FALLBACK;

  const toggleCategory = (cat: string) => {
    if (cat === 'All') {
      setSelectedCategories(['All']);
    } else {
      setSelectedCategories((prev) => {
        const withoutAll = prev.filter((c) => c !== 'All');
        if (withoutAll.includes(cat)) {
          const next = withoutAll.filter((c) => c !== cat);
          return next.length === 0 ? ['All'] : next;
        }
        return [...withoutAll, cat];
      });
    }
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let items = [...products] as ProductData[];

    if (!selectedCategories.includes('All')) {
      items = items.filter((p) => selectedCategories.includes(p.category));
    }

    items = items.filter((p) => p.price <= priceMax);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'Price: Low-High':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High-Low':
        items.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return items;
  }, [selectedCategories, priceMax, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sidebar component (reused for desktop + mobile drawer)
  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-bold text-[#191c1d] mb-4 tracking-tight uppercase text-[11px] opacity-60">
          Categories
        </h3>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]/20 transition-all accent-[#004ac6] cursor-pointer"
              />
              <span className="text-sm font-medium text-[#434655] group-hover:text-[#004ac6] transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-[#191c1d] mb-4 tracking-tight uppercase text-[11px] opacity-60">
          Price Range
        </h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={2500}
            step={50}
            value={priceMax}
            onChange={(e) => { setPriceMax(Number(e.target.value)); setCurrentPage(1); }}
            className="w-full h-1.5 bg-[#c3c6d7] rounded-full appearance-none cursor-pointer accent-[#004ac6]"
          />
          <div className="flex justify-between text-xs font-bold text-[#737686]">
            <span>$0</span>
            <span className="text-[#004ac6]">${priceMax.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-bold text-[#191c1d] mb-4 tracking-tight uppercase text-[11px] opacity-60">
          Min. Rating
        </h3>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`flex items-center gap-2 text-sm transition-colors w-full ${
                minRating === r ? 'text-[#004ac6] font-semibold' : 'text-[#434655] hover:text-[#004ac6]'
              }`}
            >
              <Stars filled={r} />
              <span className="font-medium">& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setSelectedCategories(['All']);
          setPriceMax(2500);
          setMinRating(0);
          setCurrentPage(1);
        }}
        className="w-full py-2.5 border border-[#c3c6d7] rounded-full text-xs font-bold text-[#434655] hover:border-[#004ac6] hover:text-[#004ac6] transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen font-sans antialiased">
      <Navbar />

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative ml-auto w-80 h-full bg-white shadow-2xl overflow-y-auto p-6 animate-slide-in-right">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}

      <main className="pt-24 pb-20 px-6 max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8">
        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="hidden md:block w-72 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-8">
            <FilterSidebar />
          </div>

          {/* Promo Banner */}
          <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-[#004ac6] group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
              alt="Featured Collection"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
              <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">
                Featured Collection
              </span>
              <h4 className="text-white text-xl font-bold leading-tight">
                Elevate Your Presence.
              </h4>
              <button className="mt-4 text-white text-xs font-bold flex items-center gap-2 group/btn">
                Shop Collection{' '}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────── */}
        <section className="flex-1 min-w-0">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#191c1d] tracking-tighter leading-none mb-1.5">
                All Products
              </h1>
              <p className="text-[#434655] text-sm font-medium">
                {loading ? 'Refreshing collections...' : `Showing ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}–${Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of ${filteredProducts.length} results`}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile filter button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[#c3c6d7] rounded-full text-sm font-bold text-[#434655] hover:border-[#004ac6] hover:text-[#004ac6] transition-colors shadow-sm"
              >
                <Sliders className="w-4 h-4" />
                Filters
              </button>

              {/* Search */}
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737686]" />
                <input
                  type="text"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-9 pr-4 py-2 bg-white border border-[#c3c6d7] rounded-full text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20 focus:border-[#004ac6] transition-all"
                />
              </div>

              {/* Sort pills */}
              <div className="hidden sm:flex items-center gap-1 bg-white border border-[#c3c6d7] p-1 rounded-full shadow-sm">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      sortBy === opt
                        ? 'bg-[#004ac6] text-white shadow-md'
                        : 'text-[#434655] hover:text-[#191c1d]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading / Error / Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-12 h-12 border-4 border-[#004ac6]/20 border-t-[#004ac6] rounded-full animate-spin mb-4"></div>
              <p className="text-[#434655] font-medium">Curating Products...</p>
            </div>
          ) : error ? (
             <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-red-600 text-white rounded-full text-sm font-bold"
                >
                  Retry Connection
                </button>
             </div>
          ) : (
            <>
              {/* Mobile sort — dropdown select */}
              <div className="sm:hidden mb-5">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1); }}
                  className="w-full py-2.5 px-4 bg-white border border-[#c3c6d7] rounded-full text-sm font-bold text-[#434655] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Product Grid */}
              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product as ProductData} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-20 h-20 bg-[#f3f4f5] rounded-full flex items-center justify-center mb-6">
                    <Search className="w-8 h-8 text-[#737686]" />
                  </div>
                  <h3 className="text-xl font-black text-[#191c1d] mb-2">No products found</h3>
                  <p className="text-[#434655] text-sm mb-8">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategories(['All']);
                      setPriceMax(2500);
                      setSearchQuery('');
                      setMinRating(0);
                      setCurrentPage(1);
                    }}
                    className="px-6 py-3 bg-[#004ac6] text-white rounded-full text-sm font-bold hover:bg-[#003ea8] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#434655] hover:bg-[#f3f4f5] disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1;
                const showDotsBefore = page === currentPage - 2 && currentPage > 3;
                const showDotsAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                if (showDotsBefore || showDotsAfter) {
                  return (
                    <span key={page} className="text-[#737686] px-2 select-none">
                      …
                    </span>
                  );
                }
                if (!showPage) return null;

                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all ${
                      isActive
                        ? 'bg-[#004ac6] text-white shadow-lg shadow-blue-600/25'
                        : 'text-[#434655] hover:bg-[#f3f4f5]'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#434655] hover:bg-[#f3f4f5] disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#edeeef] py-12 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-xl font-black tracking-tighter text-[#191c1d] mb-5 block">
              NNM Shop
            </span>
            <p className="text-sm text-[#434655] leading-relaxed max-w-sm mb-8">
              Defining the intersection of utility and art. We source objects that elevate your
              daily ritual and architectural presence.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#191c1d] shadow-sm hover:scale-110 transition-transform"
              >
                <span className="text-[10px] font-black">𝕏</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#191c1d] shadow-sm hover:scale-110 transition-transform"
              >
                <span className="text-[10px] font-black">in</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#191c1d] mb-6">
              Gallery
            </h4>
            <ul className="space-y-4 text-sm font-medium text-[#434655]">
              {['The Modern Desk', 'Audio Sculptures', 'Tactile Textiles', 'New Arrivals'].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-[#004ac6] transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-[#191c1d] mb-6">
              Support
            </h4>
            <ul className="space-y-4 text-sm font-medium text-[#434655]">
              {['Shipping Policy', 'Returns', 'Contact Us', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#004ac6] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-[#c3c6d7]/40 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-[10px] font-bold text-[#737686] uppercase tracking-widest">
            © 2024 NNM Shop. All rights reserved.
          </p>
          <p className="text-[10px] font-bold text-[#737686] uppercase tracking-widest">
            Designed for the Discerning Eye.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
