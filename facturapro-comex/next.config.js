/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth']
  },
  transpilePackages: ['lucide-react'],
  webpack: (config, { isServer }) => {
    // Manejar archivos PDF y otros tipos de archivos
    config.module.rules.push({
      test: /\.(pdf)$/,
      use: 'file-loader',
    });

    // Resolver problemas con canvas en el lado del cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };
    }

    return config;
  },
  // Configuración para mejorar el rendimiento
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig
