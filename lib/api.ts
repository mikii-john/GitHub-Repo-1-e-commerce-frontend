import axios from 'axios';
import * as mockData from './mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const MOCK_MODE = true; // Force Mock Mode

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock Interceptor
api.interceptors.request.use(async (config) => {
  if (MOCK_MODE) {
    console.log(`[MOCK API] ${config.method?.toUpperCase()} ${config.url}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    let data: any = null;

    if (config.url === '/products' && config.method === 'get') {
      data = mockData.mockProducts;
    } else if (config.url?.startsWith('/products/') && config.method === 'get') {
      const id = config.url.split('/').pop();
      data = mockData.mockProducts.find(p => p._id === id) || mockData.mockProducts[0];
    } else if (config.url === '/auth/login' && config.method === 'post') {
      const parsedData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      const { email } = parsedData;
      const user = mockData.mockUsers.find(u => u.email === email) || mockData.mockUsers[2]; // Default to buyer
      data = { token: 'mock-token-' + Date.now(), user };
    } else if (config.url === '/auth/register' && config.method === 'post') {
      const parsedData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      const { name, email, role } = parsedData;
      data = { token: 'mock-token-' + Date.now(), user: { _id: 'u' + Date.now(), name, email, role } };
    } else if (config.url === '/admin/staff' && config.method === 'get') {
      data = mockData.mockStaff;
    } else if (config.url === '/admin/disputes' && config.method === 'get') {
      data = mockData.mockDisputes.map(d => ({
        ...d,
        order_id: mockData.mockOrders.find(o => o._id === d.order_id) || d.order_id
      }));
    } else if (config.url?.startsWith('/orders') && config.method === 'get') {
      data = mockData.mockOrders.map(o => ({
        ...o,
        product_id: mockData.mockProducts.find(p => p._id === o.product_id) || o.product_id
      }));
    } else if (config.url === '/orders' && config.method === 'post') {
      data = { 
        _id: 'o' + Date.now(), 
        status: 'Pending', 
        payment_status: 'Unpaid',
        ...JSON.parse(config.data) 
      };
    } else if (config.url === '/payments/initialize' && config.method === 'post') {
      data = { 
        checkout_url: '/dashboard/buyer?status=mock-payment-success',
        status: 'success'
      };
    } else if (config.url?.startsWith('/profile') && config.method === 'get') {
      data = mockData.mockUsers[2]; // Mock buyer profile
    }


    if (data) {
      // Create a mock response
      const mockResponse = {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
      
      // Axios will see this as a fulfilled request
      return Promise.reject({ response: mockResponse });
    }
  }

  // Real request logic
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Handle the "mock response" that was rejected above
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If it's our mock response, resolve it as a successes
    if (error.response && error.response.status === 200 && MOCK_MODE) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);

export default api;

