/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
};

// const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // pwa: {
  // dest: 'public',
  // disable: true,
  // disable: process.env.NODE_ENV === 'development',
  // },
};

module.exports = nextConfig;
