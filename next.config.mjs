/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["tailwind-merge", "clsx"],
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
