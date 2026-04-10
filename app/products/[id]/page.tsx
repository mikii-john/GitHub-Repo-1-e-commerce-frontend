'use client';

import React, { useEffect, useState, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingCart, 
  ShieldCheck, 
  ChevronRight, 
  PlayCircle,
  Star,
  Zap,
  Heart,
  CheckCircle,
  Edit,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  countInStock: number;
  seller_id?: string;
  imageUrl?: string;
}

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
        category: product.category || 'Product',
        quantity: quantity
      });
      router.push('/cart');
    }
  };

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
      const { data: orderData } = await api.post('/orders', {
        orderItems: [
          {
            product: product?._id,
            qty: quantity
          }
        ],
        shippingAddress: {
          address: "Pending Address",
          city: "Pending City",
        },
        paymentMethod: "Chapa",
        itemsPrice: product?.price * quantity,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: product?.price * quantity,
      });

      const { data: paymentData } = await api.post(`/payments/initialize/${orderData._id}`);

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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Oops!</h2>
        <p className="text-slate-500 mb-8 text-center max-w-sm">{error}</p>
        <Link href="/" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">
          Back to Shop
        </Link>
      </div>
    );
  }

  const defaultImage = product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80';

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans antialiased">
      <Navbar />
      
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 tracking-wide uppercase font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="#" className="hover:text-blue-600 transition-colors">{product.category || 'Category'}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Product Gallery Section */}
          <div className="lg:col-span-7">
            <div className="bg-slate-200/50 rounded-xl overflow-hidden group">
              <img 
                src={defaultImage}
                alt={product.name}
                className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="flex flex-col gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    {product.category || 'Product'}
                  </span>
                </div>
                
                <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-medium text-blue-600">Birr {product.price.toFixed(2)}</span>
                  {product.price > 100 && (
                     <span className="text-slate-500 line-through text-lg">Birr {(product.price * 1.25).toFixed(2)}</span>
                  )}
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-lg">
                {product.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-200">
                <div className="p-4 bg-white shadow-sm border border-slate-100 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase block mb-1">Stock</span>
                  <span className="text-sm font-medium text-slate-900">
                    {product?.countInStock > 0 ? `${product.countInStock} Units Available` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-6">
                <button 
                  disabled={product.countInStock <= 0}
                  className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-sm tracking-wide hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  ADD TO CART
                </button>
                
                <div className="flex gap-4">
                  <button 
                    onClick={handleBuy}
                    disabled={buying || product.countInStock <= 0}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {buying ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" /> BUY NOW
                      </>
                    )}
                  </button>
                  <button className="w-[56px] shrink-0 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-slate-200 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                {/* Integration Hint */}
                <div className="flex items-center justify-center gap-4 py-2 opacity-60">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Secure Checkout by Chapa</span>
                  <div className="h-4 w-px bg-slate-300"></div>
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs Section */}
        <section className="mt-32">
          <div className="flex gap-12 border-b border-slate-200 mb-12">
            {[
              { id: 'description', label: 'Description' },
              { id: 'shipping', label: 'Shipping & Returns' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-bold text-sm tracking-widest uppercase transition-colors border-b-2
                  ${activeTab === tab.id 
                    ? 'border-blue-600 text-slate-900' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="text-slate-600 py-12">
              <p className="leading-relaxed text-lg whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}
          
          {activeTab === 'shipping' && (
             <div className="text-slate-600 py-12 text-center">
               <h3 className="text-xl font-bold text-slate-900 mb-4">Shipping & Returns</h3>
               <p className="mb-4">We offer standard delivery for all products. Shipping costs are calculated at checkout based on your location.</p>
               <p>If you are not entirely satisfied with your purchase, you may return the item in its original condition within 30 days of receipt.</p>
             </div>
          )}
        </section>
      </main>

      <footer className="bg-slate-100 py-16 px-6 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <span className="text-2xl font-bold tracking-tighter text-slate-900 block mb-6">Adare Shop</span>
            <p className="text-slate-600 text-sm leading-relaxed">
              Treating e-commerce as a gallery experience. Our mission is to provide high-end, editorial quality items for your digital home.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <h5 className="font-bold text-xs tracking-[0.2em] uppercase text-slate-900 mb-6">Discover</h5>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Catalog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Collections</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Designers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-xs tracking-[0.2em] uppercase text-slate-900 mb-6">Service</h5>
              <ul className="space-y-4 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Sustainability</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-slate-500">
          <p>© 2024 Adare Shop. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
