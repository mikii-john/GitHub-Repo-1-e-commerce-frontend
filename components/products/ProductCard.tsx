'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category?: string;
  countInStock: number;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card group overflow-hidden flex flex-col h-full bg-card"
    >
      {/* Product Image Placeholder */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <div className="absolute inset-0 flex items-center justify-center text-muted group-hover:scale-110 transition-transform duration-500">
          <ShoppingCart className="w-16 h-16 opacity-10" />
        </div>
        
        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded text-[10px] font-bold uppercase tracking-wider text-foreground">
            {product.category}
          </div>
        )}

        {/* Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none group-hover:pointer-events-auto">
          <Link 
            href={`/products/${product._id}`}
            className="w-full py-2 bg-primary text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            Quick View <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 text-xs text-yellow-500 mb-1">
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3" />
          <span className="text-muted ml-1">(4.0)</span>
        </div>
        
        <Link href={`/products/${product._id}`}>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-muted font-medium line-through decoration-secondary/50">$ {(product.price * 1.2).toFixed(2)}</span>
            <span className="text-xl font-black text-foreground">$ {product.price.toFixed(2)}</span>
          </div>
          
          <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${
            product.countInStock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {product.countInStock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
