export const mockProducts = [
  {
    _id: 'p1',
    name: 'Aether Ultra Headphones',
    description: 'Next-generation noise cancellation with spatial audio technology.',
    price: 349,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    stock: 12,
    seller_id: 's1'
  },
  {
    _id: 'p2',
    name: 'Neo Minimalist Watch',
    description: 'A timeless design featuring a sustainable titanium body.',
    price: 189,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    stock: 45,
    seller_id: 's1'
  },
  {
    _id: 'p3',
    name: 'Lumina Smart Lamp',
    description: 'Dynamic lighting that adapts to your circadian rhythm.',
    price: 89,
    category: 'Home & Living',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80',
    stock: 28,
    seller_id: 's2'
  },
  {
    _id: 'p4',
    name: 'Zenith Camera Lens',
    description: 'Precision optics for professional-grade photography.',
    price: 1200,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    stock: 5,
    seller_id: 's2'
  },
  {
    _id: 'p5',
    name: 'Evo Wireless Mouse',
    description: 'Ergonomic design with ultra-low latency connection.',
    price: 75,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    stock: 150,
    seller_id: 's1'
  },
  {
    _id: 'p6',
    name: 'Aurora Mechanical Keyboard',
    description: 'Tactile typing experience with customizable RGB lighting.',
    price: 159,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80',
    stock: 30,
    seller_id: 's2'
  },
];

export const mockUsers = [
  { _id: 'u1', name: 'Admin User', email: 'admin@mock.com', role: 'admin' },
  { _id: 'u2', name: 'Seller User', email: 'seller@mock.com', role: 'seller' },
  { _id: 'u3', name: 'Buyer User', email: 'buyer@mock.com', role: 'buyer' },
  { _id: 'u4', name: 'Staff Support', email: 'staff@mock.com', role: 'staff' },
];

export const mockOrders = [
  {
    _id: 'o1',
    buyer_id: 'u3',
    seller_id: 's1',
    product_id: 'p1',
    quantity: 1,
    total_amount: 349,
    status: 'Paid',
    payment_status: 'Held',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'o2',
    buyer_id: 'u3',
    seller_id: 's2',
    product_id: 'p3',
    quantity: 2,
    total_amount: 178,
    status: 'Shipped',
    payment_status: 'Held',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const mockDisputes = [
  { 
    _id: 'd1', 
    order_id: 'o1', 
    reason: 'Item not as described', 
    status: 'Open', 
    createdAt: new Date(Date.now() - 43200000).toISOString() 
  }
];

export const mockStaff = [
  { _id: 's1', name: 'Julianne Devis', email: 'julianne.d@example.com', role: 'staff', status: 'Active' },
  { _id: 's2', name: 'Marcus Miller', email: 'm.miller@techhub.io', role: 'staff', status: 'Active' },
  { _id: 's3', name: 'Sarah Kovit', email: 'sarah.k@design.com', role: 'staff', status: 'Active' }
];
