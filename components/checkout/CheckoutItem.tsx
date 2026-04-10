'use client';

import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CheckoutItemProps {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  quantity: number;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({ id, name, category, price, imageUrl, quantity, onUpdateQuantity, onRemove }) => {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-lg flex gap-6 items-center group transition-all duration-300 hover:shadow-lg hover:shadow-on-surface/5">
      <div className="w-24 h-24 rounded-default overflow-hidden shrink-0 relative">
        <Image 
          src={imageUrl} 
          alt={name} 
          fill
          className="object-cover"
        />
      </div>
      <div className="grow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-outline uppercase mb-1">{category}</p>
            <h3 className="text-lg font-semibold text-on-surface">{name}</h3>
          </div>
          <p className="text-lg font-bold text-primary">Birr {price.toFixed(2)}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center bg-surface-container p-1 rounded-full">
            <button 
              onClick={() => onUpdateQuantity && onUpdateQuantity(id, quantity - 1)}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors disabled:opacity-50"
            >
              <Minus size={14} />
            </button>
            <span className="px-4 text-sm font-bold">{quantity}</span>
            <button 
              onClick={() => onUpdateQuantity && onUpdateQuantity(id, quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <button 
            onClick={() => onRemove && onRemove(id)}
            className="text-error text-sm font-medium flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutItem;
