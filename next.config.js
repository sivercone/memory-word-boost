/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;
