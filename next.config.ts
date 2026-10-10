import type { NextConfig } from 'next';
const config: NextConfig = { poweredByHeader: false, images: { formats: ['image/avif', 'image/webp'], localPatterns: [{pathname:'/images/**',search:''},{pathname:'/images/**',search:'?v=2'}] } };
export default config;
