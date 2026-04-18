/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/dons',
        destination: 'https://donate.stripe.com/5kQaEQ6t57LC7KZ2jPb3q00',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
