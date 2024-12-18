import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  images: {
    domains: ['localhost'], // Add 'localhost' to allow images to be loaded from it
  },
}


export default nextConfig;
