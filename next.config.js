const nextTranslate = require('next-translate-plugin');
const webpack = require('webpack');
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'flagicons.lipis.dev',
      'd2ejtbjh8d0ry4.cloudfront.net',
    ],
  },
  swcMinify: true,
  reactStrictMode: false,
  ...nextTranslate(),
};

module.exports = nextConfig;
