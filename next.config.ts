import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Увімкнення строгого режиму React    // Ключове налаштування для статичного експорту
  async headers() {
    return [
      {
        source: '/wp-json/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Замініть вашим доменом
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  exportPathMap: async function () {
    // Оголошення типу для paths
    const paths: { [key: string]: { page: string; query?: { [key: string]: string } } } = {
      '/': { page: '/' },
      '/autorization': { page: '/autorization' },
      '/panel': { page: '/panel' },
      '/panel_type': { page: '/panel_type' },
      '/profile_type/[selectedType]': { page: '/profile_type/[selectedType]' },
      '/coating_type/[coatingType]': { page: '/coating_type/[coatingType]' },
      '/register': { page: '/register' },
      '/result': { page: '/result' },
      '/visualization': { page: '/visualization' },
      '/calculator': { page: '/calculator' },
    };

    // Динамічно генеруємо шляхи для profile_type
    const profileTypes = ["aluminum_anodized", "aluminum_non_anodized", "zinc-steel-profs", "zinc-profs"];
    profileTypes.forEach((type) => {
      paths[`/profile_type/${type}`] = { page: '/profile_type/[selectedType]' };
    });

    const coatingTypes = ["flat", "pitched"];
    coatingTypes.forEach((type) => {
      paths[`/coating_type/${type}`] = { page: '/coating_type/[coatingType]' };
    });

    return paths;
  }
};

export default nextConfig;
