'use client';

import React, { useState } from 'react';
import { ShoppingBag, Truck, Wallet, Lock, ArrowRight, CheckCircle2, History, ShieldCheck, Headphones } from 'lucide-react';
import api from '@/lib/api';
import CheckoutItem from '@/components/checkout/CheckoutItem';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

import { useAuth } from '@/context/AuthContext';

const CartPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card'>('mobile');
  
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 20.00 : 0;
  const taxes = subtotal > 0 ? 45.00 : 0;
  const total = subtotal + shipping + taxes;

  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  const handleCompletePurchase = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth?redirect=/cart';
      return;
    }

    setBuying(true);
    setError('');
    try {
      const orderData = {
        orderItems: cartItems.map(i => ({ product: i._id, qty: i.quantity })),
        shippingAddress: { address: "Address Info pending", city: "City Info pending" },
        paymentMethod: paymentMethod === 'mobile' ? 'Mobile Money' : 'Card',
        itemsPrice: subtotal,
        taxPrice: taxes,
        shippingPrice: shipping,
        totalPrice: total
      };
      
      const { data: newOrder } = await api.post('/orders', orderData);
      
      const { data: paymentData } = await api.post(`/payments/initialize/${newOrder._id}`);
      
      if (paymentData.checkout_url) {
        clearCart();
        window.location.href = paymentData.checkout_url;
      } else {
        throw new Error('Payment initialization failed');
      }
    } catch (err) {
      console.error('Checkout failed', err);
      // @ts-expect-error error is unknown
      setError(err?.response?.data?.message || err?.message || 'Payment initialization failed. Please try again.');
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      {/* Navigation (Usually shared - updated with back to home) */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-outline-variant/30">
        <div className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-slate-50">Adare Shop</Link>
            <div className="hidden md:flex gap-6 items-center text-sm font-medium">
              <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all font-bold text-primary border-b-2 border-primary" href="/cart">Cart</Link>
              <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all" href="/products">Categories</Link>
              <Link className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all" href="/products">Deals</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/" className="text-xs font-bold text-outline hover:text-primary transition-colors">Return to Shop</Link>
             <div className="relative p-2 bg-surface-container rounded-full text-primary">
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartItems.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Progress Tracker */}
        <div className="flex items-center justify-center mb-12 space-x-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">1</span>
            <span className="text-sm font-semibold text-on-surface">Review Cart</span>
          </div>
          <div className="h-px w-8 md:w-16 bg-outline-variant/30"></div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center text-xs font-bold">2</span>
            <span className="text-sm font-semibold text-on-surface">Shipping</span>
          </div>
          <div className="h-px w-8 md:w-16 bg-outline-variant/30"></div>
          <div className="flex items-center gap-2 opacity-40">
            <span className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs font-bold">3</span>
            <span className="text-sm font-semibold text-on-surface">Secure Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cart Content */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Section: Your Cart */}
            <section className="bg-surface-container-low p-8 rounded-xl shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/10">
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <ShoppingBag className="text-primary" size={32} />
                  Your Shopping Cart
                </h1>
                <span className="text-sm font-bold text-outline uppercase tracking-widest">{cartItems.length} Items</span>
              </div>
              
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12 text-secondary">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Your cart is empty.</p>
                    <Link href="/products" className="inline-block mt-4 text-primary font-bold hover:underline">Continue Shopping</Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <CheckoutItem 
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      category={item.category}
                      price={item.price}
                      imageUrl={item.imageUrl}
                      quantity={item.quantity}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))
                )}
              </div>
            </section>

            {/* Section: Shipping (as part of cart flow) */}
            <section className="bg-surface-container-low p-8 rounded-xl shadow-sm border border-outline-variant/20">
              <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-3">
                <Truck className="text-primary" />
                Delivery Information
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-outline px-1">Full Delivery Name</label>
                  <input className="w-full bg-surface-container-lowest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant outline-none" placeholder="John Doe" type="text" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-outline px-1">Detailed Street Address</label>
                  <input className="w-full bg-surface-container-lowest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant outline-none" placeholder="123 Gallery Lane, Art District" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-outline px-1">City / Region</label>
                  <input className="w-full bg-surface-container-lowest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant outline-none" placeholder="Addis Ababa" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-outline px-1">Zip / Postal Code</label>
                  <input className="w-full bg-surface-container-lowest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline-variant outline-none" placeholder="1000" type="text" />
                </div>
              </form>
            </section>

            {/* Section: Payment Hub (Chapa) */}
            <section className="bg-surface-container-low p-8 rounded-xl shadow-sm border border-outline-variant/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                  <Wallet className="text-primary" />
                  Payment Methods
                </h2>
                <div className="px-3 py-1 bg-primary/10 rounded-lg text-[10px] font-black text-primary border border-primary/20 tracking-tighter">
                   POWERED BY CHAPA
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-secondary mb-4 leading-relaxed">Choose how you&apos;d like to pay. Your transaction is held in secure escrow for your protection.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mobile Money */}
                  <label className={`relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'mobile' ? 'border-primary bg-primary-fixed/20 shadow-md translate-y-[-2px]' : 'border-transparent bg-surface-container-lowest hover:border-primary/20'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      className="sr-only" 
                      checked={paymentMethod === 'mobile'} 
                      onChange={() => setPaymentMethod('mobile')}
                    />
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'mobile' ? 'border-primary bg-primary' : 'border-outline-variant'} flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-full bg-white ${paymentMethod === 'mobile' ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                    </div>
                    <span className="font-black text-on-surface tracking-tight">Mobile Money</span>
                    <span className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest opacity-70">Telebirr, M-Pesa, etc.</span>
                  </label>

                  {/* Cards */}
                  <label className={`relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'card' ? 'border-primary bg-primary-fixed/20 shadow-md translate-y-[-2px]' : 'border-transparent bg-surface-container-lowest hover:border-primary/20'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      className="sr-only" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <History size={24} />
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'card' ? 'border-primary bg-primary' : 'border-outline-variant'} flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-full bg-white ${paymentMethod === 'card' ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                    </div>
                    <span className="font-black text-on-surface tracking-tight">International Cards</span>
                    <span className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest opacity-70">Visa, Mastercard, Amex</span>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Calculations (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              <section className="bg-surface-container-high p-10 rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 rounded-full"></div>
                <h3 className="text-2xl font-black tracking-tighter mb-10">Order Summary</h3>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 mb-6 flex items-center justify-center text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-secondary">
                    <span className="text-sm font-medium tracking-tight">Subtotal</span>
                    <span className="text-md font-black text-on-surface">Birr {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span className="text-sm font-medium tracking-tight">Standard Shipping</span>
                    <span className="text-md font-black text-on-surface">Birr {shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary">
                    <span className="text-sm font-medium tracking-tight">Tax Estimate</span>
                    <span className="text-md font-black text-on-surface">Birr {taxes.toFixed(2)}</span>
                  </div>
                  <div className="pt-8 border-t border-outline-variant/30 flex justify-between items-end">
                    <div>
                      <span className="block text-[10px] font-black uppercase text-secondary tracking-widest mb-1">Final Amount</span>
                      <span className="text-sm font-medium text-secondary">(Birr Incl. Tax)</span>
                    </div>
                    <span className="text-4xl font-black text-primary tracking-tighter">Birr {total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCompletePurchase}
                  disabled={buying || cartItems.length === 0}
                  className="w-full py-6 rounded-2xl bg-linear-to-br from-primary to-primary-container text-on-primary font-black text-lg shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4 group mb-8 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {buying ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Pay Securely Now
                      <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={24} />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3 justify-center text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">
                  <Lock size={14} />
                  256-bit SSL Data Encryption
                </div>
              </section>

              {/* Trust Section */}
              <div className="grid grid-cols-3 gap-4 px-2">
                <div className="bg-surface-container-low p-4 rounded-xl text-center border border-outline-variant/10 shadow-sm">
                  <div className="flex justify-center mb-2">
                    <ShieldCheck className="text-primary" size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary block">Verified</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl text-center border border-outline-variant/10 shadow-sm">
                  <div className="flex justify-center mb-2">
                    <History className="text-primary" size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary block">Returns</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl text-center border border-outline-variant/10 shadow-sm">
                  <div className="flex justify-center mb-2">
                    <Headphones className="text-primary" size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary block">Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="mt-20 py-16 bg-surface-container-low border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-2xl font-black tracking-tighter text-slate-900 block mb-4">Adare Shop</span>
          <p className="text-sm text-secondary max-w-lg mx-auto leading-relaxed mb-10">Experience the world&apos;s most curated editorial shopping marketplace, powered by secure blockchain-ready escrow payments.</p>
          <div className="flex justify-center gap-10 text-xs font-black uppercase text-outline tracking-widest">
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
            <a className="hover:text-primary transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;
