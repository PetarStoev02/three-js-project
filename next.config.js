/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(fbx|glb|gltf)$/,
      use: {
        loader: 'file-loader',
      },
    });
    return config;
  },
}

module.exports = nextConfig; 