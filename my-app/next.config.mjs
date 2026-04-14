/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    API_URL: process.env.API_URL || 'http://localhost:5000/api',
  },
};

export default nextConfig;
